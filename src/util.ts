export type IndentType = number | "tab" | "none";

export function createIndent(type: IndentType, level: number): string {
  if (type === "none") {
    return "";
  }

  if (type === "tab") {
    return "\n" + "\t".repeat(level);
  }

  return "\n" + " ".repeat(type * level);
}
