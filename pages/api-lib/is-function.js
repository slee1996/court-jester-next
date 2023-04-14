export default function isFunction(str) {
  // Regular function expression
  const functionRegex =
    /^function\s+([\w$]+)?\s*\(([\w\s,$]*)\)\s*\{([\s\S]*\})/;
  // Arrow function expression
  const arrowFunctionRegex = /^\(([\w\s,$]*)\)\s*=>\s*\{([\s\S]*\})/;

  // Return true if the input string matches any of the regular expressions
  return functionRegex.test(str) || arrowFunctionRegex.test(str);
}
