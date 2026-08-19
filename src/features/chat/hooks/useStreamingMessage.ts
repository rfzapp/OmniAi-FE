import { useRef } from "react";

const BASE_CHARS_PER_TICK = 6;
const TICK_MS = 12;
// For longer responses, increase chars per tick so the reveal doesn't drag
function charsPerTick(totalLength: number): number {
  if (totalLength > 3000) return 20;
  if (totalLength > 1500) return 12;
  if (totalLength > 600) return 8;
  return BASE_CHARS_PER_TICK;
}

/**
 * Reveals `fullText` progressively into `onTick`, simulating token
 * streaming on top of a non-streaming API that resolves with the full reply.
 */
export function useStreamingMessage() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function start(fullText: string, onTick: (partial: string) => void, onDone: () => void) {
    stop();
    // For very short responses just show immediately
    if (fullText.length <= 40) {
      onTick(fullText);
      onDone();
      return;
    }
    let index = 0;
    const step = charsPerTick(fullText.length);
    timerRef.current = setInterval(() => {
      index += step;
      onTick(fullText.slice(0, index));
      if (index >= fullText.length) {
        stop();
        onDone();
      }
    }, TICK_MS);
  }

  function stop() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  return { start, stop };
}
