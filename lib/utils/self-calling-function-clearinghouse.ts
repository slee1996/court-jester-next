export const selfCallingFunctionClearinghouse = (str: string): string => {
  // Check if the string represents a function
  const functionRegex =
    /^function\s+([\w$]+)?\s*\(([\w\s,$]*)\)\s*\{([\s\S]*\})/;
  const arrowFunctionRegex = /^\(([\w\s,$]*)\)\s*=>\s*\{([\s\S]*\})/;

  if (functionRegex.test(str) || arrowFunctionRegex.test(str)) {
    // If it's a function, make it a self-calling function
    return `(${str})()`;
  }

  // If it's not a function, return the original string
  return str;
};
