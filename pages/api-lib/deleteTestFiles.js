import fs from "fs/promises";
import path from "path";

async function deleteTestFiles() {
  const rootDir = process.cwd();

  try {
    const files = await fs.readdir(rootDir);

    for (const file of files) {
      if (path.extname(file) === ".js" && file.endsWith(".test.js")) {
        try {
          await fs.unlink(path.join(rootDir, file));
          console.log(`Deleted test file: ${file}`);
        } catch (err) {
          console.error(`Error deleting file: ${err}`);
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory: ${err}`);
  }
}

module.exports = deleteTestFiles;
