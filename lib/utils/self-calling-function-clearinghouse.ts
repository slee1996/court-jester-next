export const selfCallingFunctionClearinghouse = (
  str: string,
  argument?: any
): string => {
  const functionRegex =
    /^function\s+([\w$]+)?\s*\(([\w\s,$]*)\)\s*\{([\s\S]*\})/;
  const arrowFunctionRegex = /^\(([\w\s,$]*)\)\s*=>\s*\{([\s\S]*\})/;

  if (functionRegex.test(str) || arrowFunctionRegex.test(str)) {
    return `(${str})(${argument})`;
  }

  // If it's not a function, return the original string
  return str;
};
