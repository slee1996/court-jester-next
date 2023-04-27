import fs from 'fs/promises';
import path from 'path';

export const deleteTestFiles = async (): Promise<void> => {
  const rootDir = process.cwd();

  try {
    const files = await fs.readdir(rootDir);

    for (const file of files) {
      if (path.extname(file) === '.js' && file.endsWith('.test.js')) {
        try {
          await fs.unlink(path.join(rootDir, file));
          console.log(`Deleted test file: ${file}`);
        } catch (err) {
          console.error(`Error deleting file: ${(err as Error).message}`);
        }
      }
    }
  } catch (err) {
    console.error(`Error reading directory: ${(err as Error).message}`);
  }
}
