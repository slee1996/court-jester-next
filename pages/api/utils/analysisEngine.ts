import { lintRunner, vmRunner } from "@/lib/api";
import fs from "fs";
import { transpile } from "typescript";
import { inferArgsAndTypes } from "./inferArgsAndTypes";
import { selfCallingFunctionClearinghouse } from "@/lib/utils";
import { argFactory } from "./argFactory";
import path from "path";

export const analysisEngine = async (
  codeToAnalyze: string[],
  prompt: string
) => {
  try {
    const tempDir = "temp";
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const filesToLint = codeToAnalyze.map((str, i) => {
      const fileTitle = `codeToAnalyze${i}.ts`;
      const filePath = path.join(tempDir, fileTitle);
      fs.writeFileSync(filePath, str);

      return `./${filePath}`;
    });
    const lintResults = await lintRunner(filesToLint);
    // stream test results to client here
    // redis.stream lintResults[0]
    // if lint errors return error to giacomo client here

    const transpiledCode = codeToAnalyze.map((code) => transpile(code));
    const argsAndTypes = codeToAnalyze.map((code) => inferArgsAndTypes(code));
    const fnArgs = argsAndTypes.flatMap((arg) =>
      arg?.args.map((arg) => argFactory(arg.type))
    );
    console.log(fnArgs.flat());

    const vmPromises = await Promise.all(
      transpiledCode.map(async (code) => {
        const selfCall = selfCallingFunctionClearinghouse(code, fnArgs[0]);
        return vmRunner(selfCall);
      })
    );
  } catch (error) {
    console.log(error);
  }
};
