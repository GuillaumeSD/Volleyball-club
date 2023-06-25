export const isNotNull = <T>(value: T | null): value is T => value !== null;

export const capitalizeWords = (str: string): string =>
  str
    .split(" ")
    .map((word) => {
      if (word.includes("'")) {
        return word
          .split("'")
          .map((w) => handleCapitalizeWord(w))
          .join("'");
      }

      if (word.includes("-")) {
        return word
          .split("-")
          .map((w) => handleCapitalizeWord(w))
          .join("-");
      }

      if (word.includes(".")) {
        return word.toUpperCase();
      }

      return handleCapitalizeWord(word);
    })
    .join(" ");

const handleCapitalizeWord = (word: string): string => {
  const lowerCaseWord = word.toLowerCase();
  if (lowerCaseWords.includes(lowerCaseWord)) return lowerCaseWord;
  if (upperCaseWords.includes(lowerCaseWord))
    return lowerCaseWord.toUpperCase();
  return word.charAt(0).toUpperCase() + lowerCaseWord.slice(1);
};

const lowerCaseWords = ["de", "sur"];

const upperCaseWords = ["rac", "lso", "as", "sp", "vb", "fce", "en"];
