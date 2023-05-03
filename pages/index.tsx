import { Inter } from "next/font/google";
import { useState, useEffect } from "react";
import { MainContent } from "./components/MainContent";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [prompt, setPrompt] = useState<string>(
    `describe("add function", () => {test('add function should add multiple numbers', () => { expect(addFn("5","0",5)).toBe(10) });test('should add two positive integers', () => { expect(addFn(2,2)).toBe(4) });})`
  );
  const [numberOfResponses, setNumberOfResponses] = useState<number>(1);
  const [chats, setChats] = useState<Response | null>();
  const [messages, setMessages] = useState<Set<any>>(new Set());
  const [loading, setLoading] = useState<boolean>(false);

  const handleSliderChange = (newValue: number) => {
    setNumberOfResponses(newValue);
  };

  const sendPrompt = async () => {
    setLoading(true);
    setMessages(new Set());
    try {
      const res = await fetch("http://localhost:3000/api/promptGpt", {
        method: "POST",
        mode: "cors",
        body: JSON.stringify({
          prompt: { role: "user", content: prompt },
          numberOfResponses: numberOfResponses,
        }),
      });
      const data = await res.json();

      setChats(data);
      setLoading(false);
    } catch (error: any) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    const eventSourceUrl = "/api/ssePromptGpt";
    const eventSource = new EventSource(eventSourceUrl);

    eventSource.onmessage = (event) => {
      console.log("Received event:", event.data);
      setMessages((currentValue) => {
        return currentValue.has(event.data)
          ? currentValue
          : // @ts-ignore
            new Set([...currentValue, event.data]);
      });
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <>
      {Array.from(messages).length > 0 &&
        Array.from(messages).map((message, i) => <div key={i}>{message}</div>)}
      <MainContent
        setPrompt={setPrompt}
        numberOfResponses={numberOfResponses}
        handleSliderChange={handleSliderChange}
        setChats={setChats}
        sendPrompt={sendPrompt}
        chats={chats as Response}
      />
    </>
  );
}
