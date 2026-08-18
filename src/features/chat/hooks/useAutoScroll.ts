"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

function findScrollContainer(node: HTMLElement | null): HTMLElement | null {
  let el = node?.parentElement;
  while (el) {
    const style = window.getComputedStyle(el);
    if (style.overflowY === "auto" || style.overflowY === "scroll") {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

/**
 * Auto-scrolls to bottom as messages stream in.
 * Stops immediately when the user scrolls up (wheel or touch).
 * Resumes only when the user scrolls back near the bottom.
 */
export function useAutoScroll<T>(dependency: T) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLElement | null>(null);
  const shouldAutoScroll = useRef(true);
  const isProgrammaticScroll = useRef(false);

  function getScrollContainer() {
    if (scrollContainerRef.current) return scrollContainerRef.current;
    const container = findScrollContainer(bottomRef.current);
    if (container) scrollContainerRef.current = container;
    return container;
  }

  useEffect(() => {
    const container = getScrollContainer();
    if (!container) return;

    function onWheel(e: WheelEvent) {
      if (e.deltaY < 0) {
        shouldAutoScroll.current = false;
      }
    }

    function onScroll() {
      if (isProgrammaticScroll.current) return;

      const { scrollTop, scrollHeight, clientHeight } = container!;
      const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
      shouldAutoScroll.current = distanceFromBottom < 80;
    }

    let touchStartY = 0;
    function onTouchStart(e: TouchEvent) {
      touchStartY = e.touches[0]?.clientY ?? 0;
    }

    function onTouchMove(e: TouchEvent) {
      const touchY = e.touches[0]?.clientY ?? touchStartY;
      if (touchY - touchStartY > 10) {
        shouldAutoScroll.current = false;
      }
    }

    container.addEventListener("wheel", onWheel, { passive: true });
    container.addEventListener("scroll", onScroll, { passive: true });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchmove", onTouchMove, { passive: true });

    return () => {
      container.removeEventListener("wheel", onWheel);
      container.removeEventListener("scroll", onScroll);
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchmove", onTouchMove);
    };
  }, []);

  useLayoutEffect(() => {
    if (!shouldAutoScroll.current) return;

    const container = getScrollContainer();
    if (!container) return;

    isProgrammaticScroll.current = true;
    container.scrollTop = container.scrollHeight;
    requestAnimationFrame(() => {
      isProgrammaticScroll.current = false;
    });
  }, [dependency]);

  return bottomRef;
}
