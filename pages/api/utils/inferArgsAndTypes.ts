import * as ts from "typescript";

export const inferArgsAndTypes = (
  fnString: string
): { name: string; args: { arg: string; type: string }[] } | null => {
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    fnString,
    ts.ScriptTarget.Latest,
    true
  );

  function visit(node: ts.Node): ts.FunctionDeclaration | null {
    if (ts.isFunctionDeclaration(node)) {
      return node;
    }

    let foundFunction: ts.FunctionDeclaration | null = null;
    ts.forEachChild(node, (child) => {
      const result = visit(child);
      if (result) {
        foundFunction = result;
      }
    });

    return foundFunction;
  }

  const functionDeclaration = visit(sourceFile);

  if (
    functionDeclaration &&
    functionDeclaration.name &&
    functionDeclaration.parameters
  ) {
    const name = functionDeclaration.name.getText();
    const args = functionDeclaration.parameters.map((parameter) => {
      const arg = parameter.name.getText();
      const type = parameter.type ? parameter.type.getText() : "any";
      return { arg, type };
    });

    return { name, args };
  }

  return null;
};
