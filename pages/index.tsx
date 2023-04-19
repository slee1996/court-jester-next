import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import GptResponse from "./components/GptResponse";
import TestResults from "./components/TestResults";

type ChatResponse = {
  codeRunTiming: string[];
  chats: any[];
  jestRun: any;
  testsToSend: string[];
};

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [prompt, setPrompt] = useState<string>();
  const [numberOfResponses, setNumberOfResponses] = useState<number>(1);
  const [chats, setChats] = useState<ChatResponse>();

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
    console.log(data.testsToSend[0]);

    setChats(data);
  };

  return (
    <main className='flex min-h-screen flex-col items-center justify-start p-24'>
      <div>Court Jester</div>
      <div>Mass produce and test LLM code.</div>
      <div className='flex flex-col items-center'>
        <input
          className='border border-spacing-1 text-lime-500 w-[60vw] p-1 rounded-sm bg-slate-800 my-4'
          onChange={(e) => setPrompt(e.target.value)}
          placeholder='Ask for some code, watch the magic'
        />
        <button
          type='submit'
          name='Submit'
          className='text-white border border-white w-1/2 my-4 rounded-sm hover:bg-white hover:text-black'
          onClick={() => {
            sendPrompt();
          }}
        >
          submit
        </button>
      </div>
      {chats?.chats.map((chat, i) => (
        <>
          <div>{chats.codeRunTiming}</div>
          <GptResponse key={i} chat={chat.message.content} />
        </>
      ))}
      {chats && <TestResults chat={chats} />}
    </main>
  );
}
