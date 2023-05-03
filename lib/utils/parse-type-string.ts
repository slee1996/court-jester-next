import * as ts from "typescript";

export const parseTypeString = (typeString: string) => {
  // Create a TypeScript program in-memory with a single file
  const sourceFile = ts.createSourceFile(
    "temp.ts",
    `type TempType = ${typeString};`,
    ts.ScriptTarget.Latest
  );

  // Create a program with the in-memory source file
  const program = ts.createProgram({
    rootNames: [sourceFile.fileName],
    options: {},
    host: {
      getSourceFile: (fileName) =>
        fileName === sourceFile.fileName ? sourceFile : undefined,
      getDefaultLibFileName: () => "lib.d.ts",
      useCaseSensitiveFileNames: () => true,
      getCanonicalFileName: (fileName) => fileName,
      getCurrentDirectory: () => "",
      getNewLine: () => "\n",
      fileExists: (fileName) => fileName === sourceFile.fileName,
      readFile: () => "",
      writeFile: () => {},
      getSourceFileByPath: () => undefined,
      realpath: (fileName) => fileName,
      getDirectories: () => [],
    },
  });

  const typeAliasDeclaration = sourceFile.statements.find(
    ts.isTypeAliasDeclaration
  );

  if (typeAliasDeclaration) {
    const checker = program.getTypeChecker();
    const type = checker.getTypeFromTypeNode(typeAliasDeclaration.type);

    console.log("Type:", checker.typeToString(type));
    checker.typeToString(type)
  } else {
    console.error("Failed to parse type string.");
  }
}
