import { useEffect, useState } from "react";

interface TypewriterOptions {
  typeMs?: number;
  holdMs?: number;
}

/** Types each line character-by-character, holds, then advances to the next line. */
export function useTypewriter<T extends string>(lines: T[], options?: TypewriterOptions) {
  const { typeMs = 34, holdMs = 1100 } = options ?? {};
  const [lineIdx, setLineIdx] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const currentLine = lines[lineIdx] ?? "";
  const doneTyping = charCount >= currentLine.length;

  useEffect(() => {
    setCharCount(0);
  }, [lineIdx]);

  useEffect(() => {
    const max = currentLine.length;
    if (charCount >= max) {
      const hold = setTimeout(() => {
        setLineIdx((l) => (l + 1) % lines.length);
      }, holdMs);
      return () => clearTimeout(hold);
    }
    const tick = setTimeout(() => {
      setCharCount((c) => c + 1);
    }, typeMs);
    return () => clearTimeout(tick);
  }, [charCount, currentLine, typeMs, holdMs]);

  return { lineIdx, typed: currentLine.slice(0, charCount), doneTyping };
}