import AnsiToHtml from "ansi-to-html";

const converter = new AnsiToHtml();

export default function TestResults(testString: any) {
  const stringToDisplay = converter.toHtml(
    Object.values(testString)[0] as string
  );

  return (
    <pre
      dangerouslySetInnerHTML={{
        __html: stringToDisplay,
      }}
    ></pre>
  );
}
