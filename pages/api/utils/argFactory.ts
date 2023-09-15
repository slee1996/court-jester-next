import * as ts from "typescript";

function findNodeByType(
  node: ts.Node,
  typeToLookFor: (node: ts.Node) => boolean
): ts.Node | undefined {
  if (typeToLookFor(node)) {
    return node;
  }

  let foundNode: ts.Node | undefined;
  ts.forEachChild(node, (child) => {
    const result = findNodeByType(child, typeToLookFor);
    if (result) {
      foundNode = result;
    }
  });

  return foundNode;
}

export const argFactory = (typeString: string) => {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    `type example = ${typeString}`,
    ts.ScriptTarget.ESNext,
    true
  );

  const arrayTypeNode = findNodeByType(sourceFile, ts.isArrayTypeNode);
  const tupleTypeNode = findNodeByType(sourceFile, ts.isTupleTypeNode);

  if (arrayTypeNode && ts.isArrayTypeNode(arrayTypeNode)) {
    const elementType = arrayTypeNode.elementType.getText();

    if (elementType.includes("number")) {
      return [1, 2, 3];
    } else if (elementType.includes("string")) {
      return ["str", "str2", "dogsrock"];
    }
  }

  if (tupleTypeNode && ts.isTupleTypeNode(tupleTypeNode)) {
    const tupleElements = tupleTypeNode.elements.map((element) => element.getText());
    return tupleElements;
  }

  // Handle other types or throw an error if the type is not supported
};
