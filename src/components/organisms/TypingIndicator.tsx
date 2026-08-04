export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((dot) => (
        <span
          key={dot}
          className="size-1.5 rounded-full bg-muted-foreground/60 animate-bounce-dot"
          style={{ animationDelay: `${dot * 0.15}s` }}
        />
      ))}
    </div>
  );
}
