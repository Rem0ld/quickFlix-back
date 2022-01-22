export const parseBasename = basename => {
  if (typeof basename !== "string") return "";
  return basename.replaceAll(".", " ").trim().toLowerCase();
};
