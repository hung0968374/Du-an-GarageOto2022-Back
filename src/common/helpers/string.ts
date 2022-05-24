export const getStringIndex = (text: string, strToFind: string) => {
  return text.indexOf(strToFind);
};

export const stringifyArray = (array: Array<string> | string) => {
  return JSON.stringify(array);
};
