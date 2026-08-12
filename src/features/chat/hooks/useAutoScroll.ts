"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Smoothly scrolls to the bottom of the chat as messages stream in.
 * Only auto-scrolls if the user is already near the bottom — if they've
 * scrolled up to read previous messages, we don't hijack their position.
 */
export function useAutoScroll<T>(dependency: T) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isUserScrolledUp = useRef(false);

  // Track whether the user has manually scrolled up
  const handleScroll = useCallback(() => {
    const scrollContainer = bottomRef.current?.closest(".overflow-y-auto");
    if (!scrollContainer) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainer as HTMLElement;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    // Consider "near bottom" if within 150px
    isUserScrolledUp.current = distanceFromBottom > 150;
  }, []);

  // Attach scroll listener to the scroll container
  useEffect(() => {
    const scrollContainer = bottomRef.current?.closest(".overflow-y-auto");
    if (!scrollContainer) return;

    scrollContainer.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Scroll to bottom when dependency changes (new message or streaming tick)
  useEffect(() => {
    if (isUserScrolledUp.current) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [dependency]);

  return bottomRef;
}
