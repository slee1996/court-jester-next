import React from "react";
import { SubmitButton } from "./SubmitButton";
import { ChatCard } from "./ChatCard";
import SliderBar from "./SliderBar";
import TestResults from "./TestResults";
import { CodeEditor } from "./CodeEditor";

interface MainContentProps {
  setPrompt: (value: string) => void;
  numberOfResponses: number;
  handleSliderChange: (value: number) => void;
  setChats: (value: null | Response) => void;
  sendPrompt: () => void;
  chats: Response | null;
}

export const MainContent: React.FC<MainContentProps> = ({
  setPrompt,
  numberOfResponses,
  handleSliderChange,
  setChats,
  sendPrompt,
  chats,
}) => (
  <main className='flex min-h-screen flex-col items-center justify-center p-24 w-full'>
    <div>
      <h1 className='text-4xl font-bold text-white glitch'>
        Giacomo
      </h1>
    </div>
    <div>Mass produce and test LLM code.</div>
    <div className='flex flex-col items-center'>
      <CodeEditor onChangeHandler={setPrompt} />
      <SliderBar value={numberOfResponses} onChange={handleSliderChange} />
      <SubmitButton
        onClick={() => {
          setChats(null);
          sendPrompt();
        }}
      />
    </div>
    {chats && (
      <div className='w-full overflow-x-scroll border border-white p-1 m-1 rounded scrollbar-custom'>
        <TestResults chat={chats} />
      </div>
    )}
    {chats && (
      <div className='flex flex-row flex-wrap justify-center space-2 w-full px-2 relative z-[100]'>
        {chats.chats.map((chat, i) => (
          <ChatCard
            key={i}
            timing={chats.codeRunTiming[i]}
            chat={chat}
            testCode={chats.testsToSend[i]}
          />
        ))}
      </div>
    )}
  </main>
);
