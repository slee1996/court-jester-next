function getFunctionName(functionString: string): string | null {
  const functionNameRegex = /function\s+(\w+)/;
  const match = functionNameRegex.exec(functionString);

  if (match && match[1]) {
    return match[1];
  } else {
    return null;
  }
}

export default getFunctionName;
