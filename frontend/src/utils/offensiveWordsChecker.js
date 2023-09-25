import Filter from "bad-words";
const filter = new Filter();

export const containsOffensiveWords = (inputText) => {
    return filter.isProfane(inputText);
  };

