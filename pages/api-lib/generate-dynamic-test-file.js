// Import required modules and dependencies
import { Configuration, OpenAIApi } from "openai";
import extractCodeFromString from "./extract-code-from-string";
import isFunction from "./is-function";

// Set up OpenAI configuration
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_KEY,
  apiKey: process.env.OPENAI_API_KEY,
});

// Instantiate the OpenAI API
const openai = new OpenAIApi(configuration);

/**
 * Generates a Jest test file for the given function using OpenAI GPT-3.5-turbo.
 * @param {string} testFileName - The name of the test file to be generated.
 * @param {string} functionName - The name of the function to be tested (default: "testFn").
 * @param {function} fnToTest - The function to be tested.
 * @return {string} testCode - The Jest test code generated.
 */
async function generateDynamicTestFile(fnToTest) {
  try {
    const gptTest = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      n: 1,
      messages: [
        {
          role: "system",
          content:
            "You are a skilled test engineer specializing in writing high-quality Jest tests. Your primary responsibility is to ensure the reliability and robustness of the software by crafting comprehensive test cases that cover various scenarios and edge cases.",
        },
        {
          role: "user",
          content: `Create a comprehensive Jest test suite for the given function, ensuring thorough coverage of edge cases. Each test should have at least two assertions. Include the provided function directly at the top of the test file without any modifications. Do not attempt to require or import the function. Use the following format:
          ${fnToTest}
          // test suite starts here`,
        },
      ],
    });

    const gptTestCode = extractCodeFromString(
      gptTest.data.choices[0].message.content
    );

    const testCode = isFunction(fnToTest) ? `${gptTestCode}` : `${gptTestCode}`;

    return testCode;
  } catch (error) {
    console.error("Error generating dynamic test file:", error);
    throw error;
  }
}

// Export the generateDynamicTestFile function as a module
module.exports = generateDynamicTestFile;
