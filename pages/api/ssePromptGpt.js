import { readData } from "./utils/data";
import { sseClientQueue } from "./utils/sseClientQueue";
import { redis } from "../../lib/utils";

const CHANNEL_NAME = "sseChannel";

export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // const subscriber = new redis();
  // subscriber.subscribe(CHANNEL_NAME);

  // subscriber.on('message', (_channel, message) => {
  //   res.write(`data: ${message}\n\n`);
  // });

  // req.on('close', () => {
  //   subscriber.unsubscribe(CHANNEL_NAME);
  //   subscriber.quit();
  //   res.end();
  // });

}
