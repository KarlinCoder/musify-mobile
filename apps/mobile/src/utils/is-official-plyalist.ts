export const isOfficialDeezerAuthor = (authorName: string) => {
  if (!authorName || typeof authorName !== "string") return false;
  const name = authorName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
  return (
    /\b(deezer|editorial|official|oficial|curated)\b/.test(name) &&
    !/\d{3,}$/.test(name)
  );
};
