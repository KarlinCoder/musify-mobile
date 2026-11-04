export const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.slice(0, length - 3).concat("...");
};
