export interface TerminalLine {
  text: string
  color?: string
  delay?: number
}

export interface TerminalCommandItem {
  command: string
  output?: string | TerminalLine[]
}

export function normalizeLines(
  output: TerminalCommandItem["output"]
): TerminalLine[] {
  if (!output) return []
  if (typeof output === "string") {
    return output.split("\n").map((text) => ({ text }))
  }
  return output
}
