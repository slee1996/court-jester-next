import ivm from "isolated-vm";

export const vmRunner = async (code: string): Promise<void> => {
  const isolate = new ivm.Isolate({ memoryLimit: 128 });
  const context = await isolate.createContextSync();
  const jail = context.global;
  await jail.setSync("global", jail.derefInto());

  try {
    await context.evalSync(code, {
      timeout: 5000,
    });
  } catch (err: any) {
    if (err.message === "Script execution timed out.") {
      throw new Error("An infinite loop was detected!");
    } else {
      throw err;
    }
  }
};
