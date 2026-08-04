export type HistoryGroup = "Today" | "Yesterday" | "Previous 7 Days" | "Older";

export function getHistoryGroup(date: Date, now: Date = new Date()): HistoryGroup {
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const diffDays = Math.floor(
    (startOfDay(now).getTime() - startOfDay(date).getTime()) / 86_400_000
  );

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays <= 7) return "Previous 7 Days";
  return "Older";
}

export function groupByDate<T>(
  items: T[],
  getDate: (item: T) => Date,
  now: Date = new Date()
): Record<HistoryGroup, T[]> {
  const groups: Record<HistoryGroup, T[]> = {
    Today: [],
    Yesterday: [],
    "Previous 7 Days": [],
    Older: [],
  };
  for (const item of items) {
    groups[getHistoryGroup(getDate(item), now)].push(item);
  }
  return groups;
}

export function formatTimestamp(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}
