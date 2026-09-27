export const formatSecondsToMinutes = (seconds: number): string => {
  if (seconds < 0) seconds = 0;

  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const capitalize = (word: string) => {
  const letter = word[0].toUpperCase();
  const rest = word.slice(1).toLowerCase();
  return letter + rest;
};

export const formatRecordType = (type: string) => {
  if (type === "song") return "Canción";
  if (type === "album") return "Álbum";
  if (type === "ep") return "EP";
  if (type === "single") return "Single";
  return type;
};

export const shrinkText = (text: string, maxChars: number) => {
  if (!text || text.length <= maxChars) return text;

  const shrinkedText = text.slice(0, maxChars);

  const lastSpace = shrinkedText.lastIndexOf(" ");
  const trimmed =
    lastSpace > 0 ? shrinkedText.slice(0, lastSpace) : shrinkedText;

  return `${trimmed}...`;
};
