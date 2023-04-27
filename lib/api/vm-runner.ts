import ivm from "isolated-vm";
import { selfCallingFunctionClearinghouse } from "../utils";

export const vmRunner = async (code: string): Promise<void> => {
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = await isolate.createContextSync();
  const jail = context.global;
  await jail.setSync("global", jail.derefInto());

  try {
    await context.evalSync(selfCallingFunctionClearinghouse(code), {
      timeout: 5000,
    }); // Set a timeout of 5 seconds
  } catch (err: any) {
    if (err.message === "Script execution timed out.") {
      throw new Error("An infinite loop was detected!");
    } else {
      throw err;
    }
  }
};
