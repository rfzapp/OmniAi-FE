import { useRef } from "react";

const CHARS_PER_TICK = 4;
const TICK_MS = 18;

/**
 * Reveals `fullText` progressively into `onTick`, simulating token
 * streaming on top of a mock API that resolves with the full reply.
 */
export function useStreamingMessage() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function start(fullText: string, onTick: (partial: string) => void, onDone: () => void) {
    stop();
    let index = 0;
    timerRef.current = setInterval(() => {
      index += CHARS_PER_TICK;
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
