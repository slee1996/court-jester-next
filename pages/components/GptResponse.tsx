import extractCodeFromString from "../api-lib/extract-code-from-string";
import CodeBlock from "./CodeBlock";

export default function GptResponse({ chat }: { chat: string }) {
  const codeFromChat = extractCodeFromString(chat);
  console.log(codeFromChat);

  return <div>{codeFromChat && <CodeBlock code={codeFromChat} />}</div>;
}
