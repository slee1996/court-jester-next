import ivm from "isolated-vm";
import makeSelfCallingFunctionIfFunction from "./make-self-calling-function-if-function";

async function runCodeInIsolatedVm(code) {
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = await isolate.createContextSync();
  const jail = context.global;
  await jail.setSync("global", jail.derefInto());

  const bootstrap = isolate.compileScriptSync(
    "new " +
      function () {
        global.console = {
          log: function () {
            const serializedArgs = [...arguments].map((arg) =>
              JSON.stringify(arg)
            );
            $0.applyIgnored(undefined, serializedArgs, {
              result: { returnIgnored: true },
            });
          },
        };
      }
  );

  await bootstrap.run(context);

  const logCallback = function (...serializedArgs) {
    const args = serializedArgs.map((arg) => JSON.parse(arg));
    console.log(...args);
  };
  await jail.set("$0", new ivm.Reference(logCallback));

  try {
    await context.evalSync(makeSelfCallingFunctionIfFunction(code), {
      timeout: 5000,
    }); // Set a timeout of 5 seconds
  } catch (err) {
    if (err.message === "Script execution timed out.") {
      throw new Error("An infinite loop was detected!");
    } else {
      throw err;
    }
  }
}

module.exports = runCodeInIsolatedVm;
