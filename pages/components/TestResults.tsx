import AnsiToHtml from "ansi-to-html";
import CodeBlock from "./CodeBlock";
import { Recursion } from "./Recursion";

const converter = new AnsiToHtml();

export default function TestResults({ chat }: { chat: any }) {
  console.log(chat.jestRun as string);
  const stringToDisplay = converter.toHtml(chat.jestRun);
  const recursionConfig = [
    {
      name: "Test Results",
      displayChildren: false,
      children: [
        {
          name: "",
          element: (
            <div>
              <pre
                dangerouslySetInnerHTML={{
                  __html: stringToDisplay,
                }}
              ></pre>
            </div>
          ),
        },
      ],
    },
  ];
  console.log(chat.testsToSend);

  return (
    <div className='w-full flex flex-col justify-center'>
      <h2>Tests</h2>
      {chat.testsToSend &&
        chat.testsToSend.map((fn: string, i: any) => (
          <CodeBlock key={i} code={fn} />
        ))}
      <Recursion data={recursionConfig} />
    </div>
  );
}
