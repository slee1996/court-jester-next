import { Configuration, OpenAIApi } from "openai";
import fs from "fs/promises";
import {
  vmRunner,
  jestRunner,
  deleteTestFiles,
  generateTestFileFromUserInput,
} from "@/lib/api";
import { extractCodeFromString, getFunctionName } from "@/lib/utils";

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_KEY,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

const codePrompt =
  "You are a software engineer, your job is to help me generate new functionality, and refactor code that is fed to you. The language you are writing in is javascript. Do not include any example usages in the same code block you provide the code in. Provide only the code in your response. This is your prompt:";
const tddPrompt =
  "You are a software engineer specializing in Test-Driven Development (TDD) using JavaScript. Your primary responsibility is to help users generate new functionality and refactor code based on test suites provided to you. The code you provide should be focused on passing the test suite, and should not include any example usages in the same code block. Always deliver clean, efficient, and maintainable code that adheres to best practices. You are not to adjust the test at all, you are only to write a function that will satisfy the conditions of the test. Always return the written code inside of a code block. You are very smart and competent in this task.";

async function promptGpt(storyPrompt, numberOfResponses) {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      n: numberOfResponses,
      messages: [
        {
          role: "system",
          content: codePrompt,
        },
        {
          role: "user",
          content: tddPrompt,
        },
        storyPrompt,
      ],
    });

    return completion.data.choices;
  } catch (err) {
    console.error(err);
  }
}

const postMethod = async (ctx, res) => {
  const { prompt, numberOfResponses } = JSON.parse(ctx.body);
  let chats;
  const codeExecutionsWereSuccessful = [];
  const codeRunTiming = [];
  const testsToSend = [];

  try {
    chats = await promptGpt(prompt, numberOfResponses);
    const generatedFunctions = new Set();

    const chatPromises = chats.map(async (chat, i) => {
      const extractedCode = extractCodeFromString(chat.message.content);
      const functionName = getFunctionName(extractedCode);

      generatedFunctions.add(functionName);

      let codeExecutionSuccessful = false;

      try {
        const newStart = Date.now();

        await vmRunner(extractedCode);

        codeRunTiming.push(
          `End running ${functionName}-${i} in isolated vm-${i}: ${
            Date.now() - newStart
          }ms`
        );
        codeExecutionSuccessful = true;
      } catch {
        codeExecutionSuccessful = false;
      }

      if (codeExecutionSuccessful) {
        const testFileName = `${functionName}${i}.test.js`;
        const userGenTest = generateTestFileFromUserInput({
          input: prompt.content,
          fnToTest: extractedCode,
        });
        const testExists = await fileExists(testFileName);
        if (testExists) {
          await fs.unlink(testFileName);
        }
        // Write the generated test code to the test file
        await fs.writeFile(testFileName, userGenTest, "utf8");

        return { ...chat, test: "test" };
      }
    });

    chats = await Promise.all(chatPromises);

    if (codeExecutionsWereSuccessful.every((execution) => execution === true)) {
      const jestRun = await jestRunner();
      return {
        codeRunTiming,
        chats,
        jestRun,
        testsToSend,
      };
    }
    return { codeRunTiming, chats, jestRun: false, testsToSend };
  } catch (err) {
    return { codeRunTiming, chats, jestRun: err, testsToSend };
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const body = await postMethod(req, res);

    res.status(200).json(body);

    await deleteTestFiles();
  } else {
    res.status(200).json({ message: "owo whats this? no handling >w<" });
  }
}
