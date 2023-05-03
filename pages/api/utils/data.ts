import fs from 'fs';
import path from 'path';

interface Data {
  data: string;
}

const dataFilePath = path.resolve(process.cwd(), 'data.json');

export function readData(): Data {
  const rawData = fs.readFileSync(dataFilePath, 'utf-8');
  return JSON.parse(rawData);
}

export function writeData(newData: string): void {
  const jsonString = JSON.stringify({ data: newData });
  fs.writeFileSync(dataFilePath, jsonString, 'utf-8');
}
