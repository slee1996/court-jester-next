import extractCodeFromString from "../api-lib/extract-code-from-string";

export default function GptResponse({ chat }: { chat: string }) {
  const codeFromChat = extractCodeFromString(chat);
  console.log(codeFromChat);

  return (
    <div className="my-4">
      <code className="border border-white p-2">{codeFromChat}</code>
    </div>
  );
}
