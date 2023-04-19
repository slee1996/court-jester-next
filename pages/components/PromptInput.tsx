import React, { ChangeEventHandler } from "react";

interface PromptInputProps {
  onChange: ChangeEventHandler<HTMLInputElement>;
}

export const PromptInput: React.FC<PromptInputProps> = ({ onChange }) => (
  <input
    className='border border-spacing-1 text-lime-500 w-[60vw] p-1 rounded-sm bg-slate-800 my-4'
    onChange={onChange}
    placeholder='Ask for some code, watch the magic'
  />
);
