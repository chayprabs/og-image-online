export interface DiffHighlight {
  line: number;
  type: "add" | "remove";
}

/** Parse unified diff markers (+/-) into line highlight metadata. */
export function parseDiffHighlights(code: string): DiffHighlight[] {
  if (!/^\s*@@/m.test(code)) return [];
  const lines = code.split("\n");
  const result: DiffHighlight[] = [];
  let lineNum = 0;
  for (const line of lines) {
    if (line.startsWith("@@")) continue;
    lineNum += 1;
    if (line.startsWith("+") && !line.startsWith("+++")) {
      result.push({ line: lineNum, type: "add" });
    } else if (line.startsWith("-") && !line.startsWith("---")) {
      result.push({ line: lineNum, type: "remove" });
    }
  }
  return result;
}
