import React from "react";
import GptResponse from "./GptResponse";
import CodeBlock from "./CodeBlock";

interface ChatCardProps {
  timing: string;
  chat: Chat;
  testCode?: string;
}

export const ChatCard: React.FC<ChatCardProps> = ({
  timing,
  chat,
  testCode,
}) => (
  <div className='grid grid-flow-row grid-template-rows-first-row-0.25 w-1/4 border border-white rounded m-1 p-1 gap-0'>
    <div>{timing}</div>
    <div className='overflow-x-scroll scrollbar-custom'>
      <GptResponse chat={chat.message.content} />
    </div>
  </div>
);
