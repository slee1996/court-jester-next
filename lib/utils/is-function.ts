export const isFunction = (str: string): boolean => {
  // Regular function expression (including async, generator, and default parameters)
  const functionRegex = /^(async\s+)?function\s*(\*)?\s*([\w$]+)?\s*\(([\w\s=,$]*)\)\s*\{([\s\S]*\})/;
  // Arrow function expression (including async and default parameters)
  const arrowFunctionRegex = /^(async\s+)?\(([\w\s=,$]*)\)\s*=>\s*(\{([\s\S]*\})|[\s\S]*\S)/;

  // Return true if the input string matches any of the regular expressions
  return functionRegex.test(str) || arrowFunctionRegex.test(str);
};
