import { spawn } from "child_process";

export const jestRunner = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const jestProcess = spawn("yarn", ["jest"]);
    let dataOut = "";

    jestProcess.stdout.on("data", (data: Buffer) => {
      console.log(`stdout: ${data}`);
      dataOut += data.toString();
    });

    jestProcess.stderr.on("data", (data: Buffer) => {
      console.error(`stderr: ${data}`);
      dataOut += data.toString();
    });

    jestProcess.on("close", (code: number) => {
      console.log(`child process exited with code ${code}`);

      if (code === 0) {
        resolve(dataOut);
      } else {
        reject(dataOut);
      }
    });
  });
};
