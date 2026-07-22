// Converts "north indian" -> "North Indian"
export const toTitleCase = (str) =>
  str
    ? str
        .toLowerCase()
        .split(" ")
        .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
        .join(" ")
    : str;
