const { Configuration, OpenAIApi } = require("openai");
import extractCodeFromString from "../api-lib/extract-code-from-string";
import getFunctionName from "../api-lib/get-function-name";
import runCodeInIsolatedVm from "../api-lib/run-code-in-isolated-vm-js";
import runJestTests from "../api-lib/run-jest-tests";
import generateDynamicTestFile from "../api-lib/generate-dynamic-test-file";
import fs from "fs";

const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_KEY,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
  try {
    const chats = await promptGpt(prompt, numberOfResponses);
    const generatedFunctions = new Set();
    const codeExecutionsWereSuccessful = [];

    chats.forEach(async (chat, i) => {
      const extractedCode = extractCodeFromString(chat.message.content);
      const functionName = getFunctionName(extractedCode);

      generatedFunctions.add(functionName);

      const start = Date.now();

      console.log(`Start running ${functionName}-${i} in isolated vm-${i}`);

      let codeExecutionSuccessful = false;

      try {
        await runCodeInIsolatedVm(extractedCode);
        codeExecutionSuccessful = true;
      } catch {
        codeExecutionSuccessful = false;
      }

      const ms = Date.now() - start;

      console.log(
        `End running ${functionName}-${i} in isolated vm-${i}`,
        `Success: ${codeExecutionSuccessful}`,
        ms + "ms"
      );

      if (codeExecutionSuccessful) {
        // const functionCodeWithExport = `${extractedCode}\nmodule.exports = { ${
        //   extractedCode.match(/function\s+(\w+)/)[1]
        // } };`;

        // fs.writeFileSync(
        //   `${functionName}${i}.js`,
        //   extractedCode,
        //   "utf8"
        // );
        generateDynamicTestFile(
          `${functionName}${i}.test.js`,
          functionName,
          extractedCode
        );
      }
    });

    if (codeExecutionsWereSuccessful.every((success) => success === true)) {
      const jestRun = await runJestTests();
      return {
        chats,
        jestRun,
      };
    }
    return { chats, jestRun: false };
  } catch (err) {
    return err;
  }
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    const body = await postMethod(req, res);

    res.status(200).json(body);
  } else {
    res.status(200).json({ message: "owo whats this? no handling >w<" });
  }
}
