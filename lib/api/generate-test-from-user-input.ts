interface GenerateTestFileFromUserInputI {
  input: string;
  fnToTest: Function;
}

export const generateTestFileFromUserInput = ({
  input,
  fnToTest,
}: GenerateTestFileFromUserInputI) => {
  return `${fnToTest} ${input}`;
};
