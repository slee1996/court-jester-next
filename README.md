# Court Jester
Court Jester is an innovative web application that empowers users to generate and evaluate large volumes of code using advanced large language models (LLMs) like OpenAI's GPT-3. By leveraging the OpenAI API, Court Jester takes user input and produces a variety of code samples tailored to the given requirements. The application offers a user-friendly interface that enables users to not only view the generated code but also run tests and analyze the performance of the code. This unique combination of LLM-powered code generation and integrated testing capabilities makes Court Jester a valuable tool for developers looking to optimize their workflow and enhance their code quality.

## Getting Started
Clone the repository:

```
git clone https://github.com/slee1996/court-jester-fe.git
cd court-jester-fe
```

Install the dependencies:

```
yarn install
```

Run the development server:

```
yarn dev
```

The application will be available at http://localhost:3000.

## Available Scripts

In the project directory, you can run the following scripts:

`yarn dev` - Runs the app in development mode. Open http://localhost:3000 to view it in the browser. The page will reload if you make edits.

`yarn build` - Builds the app for production to the .next folder. It correctly bundles React in production mode and optimizes the build for the best performance.

`yarn start` - Starts the application in production mode. The application should be compiled with yarn build first.

`yarn lint` - Runs the linter to check for code issues and enforce code style.

## Code Generation and Testing - pages/api/promptGpt.js
This section of the application is responsible for generating JavaScript code using the OpenAI GPT-3 API and testing the generated code using Jest.

The code follows these steps:

1. Configure the OpenAI API with the provided API keys.
2. Define utility functions for checking if a file exists and prompting GPT-3.
3. Create a postMethod function that performs the following actions: 
    - Extract the prompt and number of responses from the request body. 
    - Send the prompt to the GPT-3 API and receive the generated responses.
    - For each generated response, extract the code and function name.
    - Attempt to run the extracted code in an isolated virtual machine (VM) to ensure it doesn't cause any harmful side effects or security risks. Record the execution timing and success status. 
    - If the code execution is successful, generate a Jest test file for the extracted code and write the test file to disk.
    - After all generated code snippets have been processed, check if all of them were executed successfully in the VM.
    - If all code snippets executed successfully, run the Jest tests on the generated test files.
    - Finally, return an object containing the code execution timings, generated code snippets, Jest test results, and generated test files.
4. Create an API handler that listens for POST requests and calls the `postMethod` function to process the request. The response will be a JSON object containing the results of the code generation and testing process.
5. After processing the POST request, delete any temporary test files that were created during the testing process.

By following these steps, the application can generate code using GPT, safely run the generated code in an isolated environment, and perform automated testing on the code using Jest.

## Built With
Next.js - A framework for building React applications with server-side rendering and static site generation support

React - A JavaScript library for building user interfaces

TypeScript - A typed superset of JavaScript that adds static types

Tailwind CSS - A utility-first CSS framework for rapid UI development

OpenAI - An API for generating human-like text based on input prompts

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.
