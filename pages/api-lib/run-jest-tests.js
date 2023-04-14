const { spawn } = require("child_process");

async function runJestTests() {
  return new Promise((resolve, reject) => {
    const jestProcess = spawn("yarn", ["jest"]);
    let dataOut = "";

    jestProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
      dataOut += data.toString();
    });

    jestProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
      dataOut += data.toString();
    });

    jestProcess.on("close", (code) => {
      console.log(`child process exited with code ${code}`);

      if (code === 0) {
        resolve(dataOut);
      } else {
        reject(dataOut);
      }
    });
  });
}

module.exports = runJestTests;
