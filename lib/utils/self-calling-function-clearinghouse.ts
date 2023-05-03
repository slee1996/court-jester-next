import { parseTypeString } from "./parse-type-string";

function getFunctionArguments(func: any) {
  const funcStr = func.toString();
  const argMatch = funcStr.match(/\(([^)]*)\)/);
  const args =
    argMatch && argMatch[1]
      ? argMatch[1].split(",").map((arg: any) => arg.trim())
      : [];

  return args;
}

export const selfCallingFunctionClearinghouse = (str: string): string => {
  const functionRegex =
    /^function\s+([\w$]+)?\s*\(([\w\s,$]*)\)\s*\{([\s\S]*\})/;
  const arrowFunctionRegex = /^\(([\w\s,$]*)\)\s*=>\s*\{([\s\S]*\})/;
  const args = getFunctionArguments(str);
  // infer args type
  console.log("frogs:", args[0].split(":")[1].trim());

  if (functionRegex.test(str) || arrowFunctionRegex.test(str)) {
    return `(${str})()`;
  }

  return str;
};
