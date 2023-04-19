import React, { useRef } from "react";

interface CodeBlockProps {
  code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
  const codeRef = useRef<HTMLPreElement>(null);

  const copyCode = async () => {
    if (codeRef.current) {
      try {
        await navigator.clipboard.writeText(codeRef.current.innerText);
        console.log("Code copied to clipboard");
      } catch (err) {
        console.error("Failed to copy code", err);
      }
    }
  };

  return (
    <div className='bg-gray-800 p-4 rounded-lg relative w-full'>
      <pre
        ref={codeRef}
        className='text-white text-sm font-mono p-4 rounded-lg w-full overflow-x-scroll scrollbar-custom'
      >
        {code}
      </pre>
      <button
        onClick={copyCode}
        className='absolute top-2 right-2 text-white text-xs font-semibold bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded'
      >
        Copy Code
      </button>
    </div>
  );
};

export default CodeBlock;
