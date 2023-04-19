import AnsiToHtml from "ansi-to-html";
import { Recursion } from "./Recursion";

const converter = new AnsiToHtml();

export default function TestResults({ chat }: { chat: Response }) {
  const stringToDisplay = converter.toHtml(chat.jestRun);
  const recursionConfig = [
    {
      name: "Test Results",
      displayChildren: true,
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

  return <Recursion data={recursionConfig} />;
}
