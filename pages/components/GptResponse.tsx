import extractCodeFromString from "../api-lib/extract-code-from-string";
import CodeBlock from "./CodeBlock";

export default function GptResponse({ chat }: { chat: string }) {
  const codeFromChat = extractCodeFromString(chat);
  console.log(codeFromChat);

  return (
    <div className='my-4 w-full'>
      <h2>Code from GPT</h2>
      {codeFromChat && <CodeBlock code={codeFromChat} />}
    </div>
  );
}
