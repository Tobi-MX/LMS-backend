export const extractJSON = (text) => {
  let start = text.indexOf("{");
  if (start === -1) throw new Error("No JSON found");

  let stack = 0;

  for (let i = start; i < text.length; i++) {
    if (text[i] === "{") stack++;
    if (text[i] === "}") stack--;

    if (stack === 0) {
      return text.slice(start, i + 1);
    }
  }

  throw new Error("Incomplete JSON");
};