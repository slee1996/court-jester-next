import { NextApiResponse } from "next";

interface SseClientWrapper {
  res: NextApiResponse;
}

class SseClientQueue {
  private clients: Set<SseClientWrapper>;

  constructor() {
    this.clients = new Set<SseClientWrapper>();
  }

  add(client: NextApiResponse): void {
    console.log(client)
    const clientWrapper: SseClientWrapper = { res: client };
    this.clients.add(clientWrapper);
  }

  remove(client: NextApiResponse): void {
    const clientToRemove = Array.from(this.clients).find(
      (clientWrapper) => clientWrapper.res === client
    );

    if (clientToRemove) {
      this.clients.delete(clientToRemove);
    }
  }

  forEach(callback: (client: SseClientWrapper) => void): void {
    this.clients.forEach(callback);
  }
}

export const sseClientQueue = new SseClientQueue();
