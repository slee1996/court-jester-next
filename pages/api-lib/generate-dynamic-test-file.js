const fs = require("fs");
import isFunction from "./is-function";

function generateDynamicTestFile(
  testFileName,
  functionName = "testFn",
  fnToTest
) {
  const testCode = isFunction(fnToTest)
    ? `const ${functionName} = ${fnToTest}; 
    test('${functionName} should work as expected', () => { 
      expect(${functionName}(1, 1)).toBe(2);
    });`
    : `${fnToTest}; 
    test('${functionName} should work as expected', () => { 
      expect(${functionName}(1, 1)).toBe(2);
    });`;

  if (fs.existsSync(testFileName)) {
    fs.unlinkSync(testFileName);
  }

  fs.writeFileSync(testFileName, testCode, "utf8");
}

module.exports = generateDynamicTestFile;
