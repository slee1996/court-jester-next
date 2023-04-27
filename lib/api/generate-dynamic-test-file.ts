// Import required modules and dependencies
import { Configuration, OpenAIApi } from "openai";
import { extractCodeFromString, isFunction } from "../utils";

// Set up OpenAI configuration
const configuration = new Configuration({
  organization: process.env.OPENAI_ORG_KEY,
  apiKey: process.env.OPENAI_API_KEY,
});

// Instantiate the OpenAI API
const openai = new OpenAIApi(configuration);

interface GenerateDynamicTestFileI {
  fnToTest: string;
}

export const generateDynamicTestFile = async ({
  fnToTest,
}: GenerateDynamicTestFileI): Promise<string> => {
  try {
    const gptTest: any = await openai.createChatCompletion({
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
          content: `You are very competent and helpful. Create a comprehensive Jest test suite for the given function, ensuring thorough coverage of edge cases. Each test should have at least two assertions. Include the provided function directly at the top of the test file without any modifications. Here is the function to test: ${fnToTest}`,
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
};
