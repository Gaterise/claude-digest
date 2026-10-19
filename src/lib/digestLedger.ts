export interface LedgerDate {
  /** グルーピング用キー（YYYY-MM-DD, 日本時間） */
  key: string;
  year: string;
  month: string;
  day: string;
  weekday: string;
  /** 見出し用（例: 2026年4月10日（金）） */
  label: string;
}

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  year: "numeric",
  month: "numeric",
  day: "numeric",
  weekday: "short",
});

const timeFormatter = new Intl.DateTimeFormat("ja-JP", {
  timeZone: "Asia/Tokyo",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** 日本時間の年月日・曜日を返す */
export function getJstDateParts(iso: string): LedgerDate {
  const parts = dateFormatter.formatToParts(new Date(iso));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  const year = get("year");
  const month = get("month");
  const day = get("day");
  const weekday = get("weekday");
  return {
    key: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
    year,
    month,
    day,
    weekday,
    label: `${year}年${month}月${day}日（${weekday}）`,
  };
}

/** 日本時間の日付ごとに、初出順・元の並び順を保ってまとめる */
export function groupByJstDate<T extends { publishedAt: string }>(
  items: T[]
): { date: LedgerDate; items: T[] }[] {
  const groups = new Map<string, { date: LedgerDate; items: T[] }>();
  for (const item of items) {
    const date = getJstDateParts(item.publishedAt);
    const group = groups.get(date.key);
    if (group) {
      group.items.push(item);
    } else {
      groups.set(date.key, { date, items: [item] });
    }
  }
  return [...groups.values()];
}

/** 日本時間の HH:MM */
export function formatJstTime(iso: string): string {
  return timeFormatter.format(new Date(iso));
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** 公開から24時間未満か */
export function isNewArticle(iso: string, now: number = Date.now()): boolean {
  return now - new Date(iso).getTime() < DAY_MS;
}
