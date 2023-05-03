import { NextApiRequest, NextApiResponse } from "next";
import { readData } from "./utils/data";

export const sseClients = new Set<NextApiResponse>();

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  sseClients.add(res);

  const interval = setInterval(() => {
    const data = readData();
    const stringToAddToSet =
      typeof data.data === "object" ? JSON.stringify(data.data) : data.data;

    res.write(`data: ${stringToAddToSet}\n\n`);
  }, 1);

  req.on("close", () => {
    clearInterval(interval);
    sseClients.delete(res);
    res.end();
  });
};

export default handler;
