import { Configuration, OpenAIApi } from "openai";
import fs from "fs/promises";
import extractCodeFromString from "../api-lib/extract-code-from-string";
import getFunctionName from "../api-lib/get-function-name";
import runCodeInIsolatedVm from "../api-lib/run-code-in-isolated-vm-js";
import runJestTests from "../api-lib/run-jest-tests";
import generateDynamicTestFile from "../api-lib/generate-dynamic-test-file";
import deleteTestFiles from "../api-lib/deleteTestFiles";

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

async function promptGpt(storyPrompt, numberOfResponses) {
  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      n: numberOfResponses,
      messages: [
        {
          role: "system",
          content: `You are a software engineer, your job is to help me generate new functionality, and refactor code that is fed to you. The language you are writing in is javascript. Do not include any example usages in the same code block you provide the code in. Provide only the code in your response. This is your prompt:`,
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

        await runCodeInIsolatedVm(extractedCode);

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
        const test = await generateDynamicTestFile(
          testFileName,
          functionName,
          extractedCode
        );
        // Delete existing test file if it exists
        const testExists = await fileExists(testFileName);
        if (testExists) {
          await fs.unlink(testFileName);
        }

        // Write the generated test code to the test file
        await fs.writeFile(testFileName, test, "utf8");
        console.log("frogs:", test);
        testsToSend.push(test);
      }
    });

    await Promise.all(chatPromises);

    if (codeExecutionsWereSuccessful.every((execution) => execution === true)) {
      const jestRun = await runJestTests();
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
