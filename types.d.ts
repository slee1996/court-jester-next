interface Response {
  codeRunTiming: string[];
  chats: Chat[];
  jestRun: any;
  testsToSend: string[];
}

interface Chat {
  message: {
    content: string;
    role: string;
  };
  // Add other properties as needed
  finish_reason: string;
}
