import React, {
  useRef,
  useState,
  KeyboardEventHandler,
  useEffect,
} from "react";

interface CodeEditorProps {
  onChangeHandler: any;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ onChangeHandler }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumberRef = useRef<HTMLDivElement>(null);
  const codeRef = useRef<HTMLPreElement>(null);
  const [lines, setLines] = useState<number[]>([1]);

  const updateLineNumbers = () => {
    if (!textareaRef.current) return;

    const lineCount = textareaRef.current.value.split("\n").length;
    setLines(Array.from({ length: lineCount }, (_, i) => i + 1));
  };

  useEffect(() => {
    updateLineNumbers();
  }, []);

  const copyCode = async () => {
    if (textareaRef.current) {
      try {
        await navigator.clipboard.writeText(textareaRef.current.value);
        console.log("Code copied to clipboard");
      } catch (err) {
        console.error("Failed to copy code", err);
      }
    }
  };

  const handleKeyPress: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
    // Custom handling for keypress events, like tab key support, can be implemented here.
    if (event.key === "Enter") {
      updateLineNumbers();
    }
    if (event.key === "Tab") {
      event.preventDefault(); // Prevent the default behavior (switching focus or adding a tab character)
      const start = textareaRef.current!.selectionStart;
      const end = textareaRef.current!.selectionEnd;

      // Insert two spaces at the cursor position
      textareaRef.current!.value =
        textareaRef.current!.value.substring(0, start) +
        "  " +
        textareaRef.current!.value.substring(end);

      // Move the cursor after the inserted spaces
      textareaRef.current!.selectionStart = textareaRef.current!.selectionEnd =
        start + 2;
    }
  };

  const handleScroll = () => {
    if (textareaRef.current && lineNumberRef.current) {
      lineNumberRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <div className='w-[80vw] min-h-[20vh] max-h-[80vh] flex'>
      <div
        ref={lineNumberRef}
        className='bg-gray-800 text-gray-400 font-mono text-xs p-2 whitespace-nowrap'
        style={{ userSelect: "none", minWidth: "2.5rem" }}
      >
        {lines.map((line) => (
          <div key={line}>{line}</div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        className='w-full px-4 py-2 bg-editor-bg text-lime-500 resize-none font-mono text-xs'
        spellCheck={false}
        autoCapitalize='none'
        autoComplete='off'
        autoCorrect='off'
        placeholder={`test('add function', () => { expect(addFn("5","0",5)).toBe(10) })`}
        defaultValue={`describe("add function", () => {
  test('add function should add multiple numbers', () => { expect(addFn("5","0",5)).toBe(10) });
  test('should add two positive integers', () => { expect(addFn(2,2)).toBe(4) });
});`}
        onKeyDown={handleKeyPress}
        onScroll={handleScroll}
        onChange={(e) => {
          updateLineNumbers();
          onChangeHandler(e.target.value);
        }}
      />
      <button
        onClick={copyCode}
        className='absolute text-white text-xs font-semibold bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded'
      >
        Copy Code
      </button>
    </div>
  );
};
