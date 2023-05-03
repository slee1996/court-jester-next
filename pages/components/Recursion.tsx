import React, { useEffect, useState } from "react";

interface Node {
  name: string;
  children?: Node[];
  element?: any;
  displayChildren?: Boolean;
}

interface TreeNodeProps {
  node: Node;
  depth: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth }) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    if (node.displayChildren === true) {
      setIsVisible((currentVal) => !currentVal);
    }
  }, [node]);

  const toggleVisibility = () => {
    setIsVisible((currentVal) => !currentVal);
  };

  if (!node) {
    return null;
  }

  return (
    <div
      className='border border-black flex flex-col justify-center'
      style={{ marginLeft: depth * 20 }}
    >
      <button
        onClick={toggleVisibility}
        className='text-center cursor-pointer uppercase'
      >
        {node.name ? (isVisible ? "close" : "view") : null} {node.name}
      </button>
      {node.children && isVisible && (
        <div>
          {node.children.map((child, i) => (
            <div key={i}>
              <TreeNode node={child} depth={depth + 1} />
              {child.element}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface RecursionProps {
  data: Node[];
}

export const Recursion: React.FC<RecursionProps> = ({ data }) => {
  return (
    <div className='flex flex-col justify-center'>
      {data.map((node, i) => (
        <TreeNode key={node.name + i} node={node} depth={0} />
      ))}
    </div>
  );
};
