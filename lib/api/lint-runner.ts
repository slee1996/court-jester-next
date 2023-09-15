import { exec } from "child_process";

export const lintRunner = async (files: string[]): Promise<any> => {
  return new Promise((resolve) => {
    const fileList = files.join(" ");
    const regex = /(\d+) errors?/;
    let dataOut: any = "";

    exec(
      `eslint --ext .ts --config .linter.eslintrc.js ${fileList}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error running eslint: ${error.message}`);
          dataOut = error;
        }

        if (stderr) {
          console.error(`Error output: ${stderr}`);
        }

        console.log(`Linting results:\n${stdout}`);

        dataOut = stdout.match(regex);
        resolve(dataOut);
      }
    );
  });
};
