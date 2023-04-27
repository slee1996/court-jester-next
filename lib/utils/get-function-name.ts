export const getFunctionName = (functionString: string): string | null => {
  const functionNameRegex = /(?:function\s+|\b)(\w+)\s*(?:\s*\=\s*\>|\()/;
  const match = functionNameRegex.exec(functionString);

  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
};
