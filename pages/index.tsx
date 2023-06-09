import { Inter } from "next/font/google";
import { useState } from "react";
import { MainContent } from "./components/MainContent";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [prompt, setPrompt] = useState<string>(
    `describe("add function", () => {test('add function should add multiple numbers', () => { expect(addFn("5","0",5)).toBe(10) });test('should add two positive integers', () => { expect(addFn(2,2)).toBe(4) });})`
  );
  const [numberOfResponses, setNumberOfResponses] = useState<number>(1);
  const [chats, setChats] = useState<Response | null>();

  const handleSliderChange = (newValue: number) => {
    setNumberOfResponses(newValue);
  };

  const sendPrompt = async () => {
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
  };

  return (
    <MainContent
      setPrompt={setPrompt}
      numberOfResponses={numberOfResponses}
      handleSliderChange={handleSliderChange}
      setChats={setChats}
      sendPrompt={sendPrompt}
      chats={chats as Response}
    />
  );
}
