import fs from 'fs';
import path from 'path';

export const flushTempFolder = () => {
  const tempFolderPath = path.join(__dirname, '../../../..', 'temp'); // Adjust the path as needed
  fs.readdir(tempFolderPath, (err: NodeJS.ErrnoException | null, files: string[]) => {
    if (err) {
      console.error(`Error reading the temp folder: ${err.message}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(tempFolderPath, file);
      fs.unlink(filePath, (unlinkErr: NodeJS.ErrnoException | null) => {
        if (unlinkErr) {
          console.error(`Error deleting file: ${unlinkErr.message}`);
        } else {
          console.log(`Deleted file: ${file}`);
        }
      });
    });
  });
};
