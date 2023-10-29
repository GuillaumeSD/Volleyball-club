export const formatWords = (str: string): string => {
  const sanitizedStr = str.replaceAll("�", "é");

  return sanitizedStr
    .split(" ")
    .map((word) => {
      if (word.includes("'")) {
        return word
          .split("'")
          .map((w) => capitalizeWord(w))
          .join("'");
      }

      if (word.includes("-")) {
        return word
          .split("-")
          .map((w) => capitalizeWord(w))
          .join("-");
      }

      if (word.includes(".")) {
        return word.toUpperCase();
      }

      return capitalizeWord(word);
    })
    .join(" ");
};

const capitalizeWord = (word: string): string => {
  const lowerCaseWord = word.toLowerCase();
  if (lowerCaseWords.includes(lowerCaseWord)) return lowerCaseWord;
  if (upperCaseWords.includes(lowerCaseWord))
    return lowerCaseWord.toUpperCase();
  return word.charAt(0).toUpperCase() + lowerCaseWord.slice(1);
};

const lowerCaseWords = ["de", "sur"];

const upperCaseWords = [
  "rac",
  "lso",
  "as",
  "sp",
  "vb",
  "fce",
  "en",
  "csm",
  "fvo",
];
