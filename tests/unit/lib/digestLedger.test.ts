import { describe, it, expect } from "vitest";
import {
  getJstDateParts,
  groupByJstDate,
  formatJstTime,
  isNewArticle,
} from "@/lib/digestLedger";

const a = (id: string, publishedAt: string) => ({ id, publishedAt });

describe("getJstDateParts", () => {
  it("日本時間の年月日・曜日と見出し用ラベルを返す", () => {
    expect(getJstDateParts("2026-04-10T00:00:00.000Z")).toEqual({
      key: "2026-04-10",
      year: "2026",
      month: "4",
      day: "10",
      weekday: "金",
      label: "2026年4月10日（金）",
    });
  });

  it("UTC では前日でも日本時間の日付で判定する", () => {
    expect(getJstDateParts("2026-04-09T15:30:00.000Z").key).toBe("2026-04-10");
  });
});

describe("groupByJstDate", () => {
  it("日本時間の日付ごとに、元の順序を保ってまとめる", () => {
    const groups = groupByJstDate([
      a("1", "2026-04-10T05:00:00.000Z"),
      a("2", "2026-04-09T16:00:00.000Z"), // JST 4/10 01:00
      a("3", "2026-04-09T10:00:00.000Z"), // JST 4/9
    ]);
    expect(groups.map((g) => [g.date.key, g.items.map((i) => i.id)])).toEqual([
      ["2026-04-10", ["1", "2"]],
      ["2026-04-09", ["3"]],
    ]);
  });

  it("空配列なら空のグループ", () => {
    expect(groupByJstDate([])).toEqual([]);
  });
});

describe("formatJstTime", () => {
  it("日本時間の HH:MM を返す", () => {
    expect(formatJstTime("2026-04-10T00:05:00.000Z")).toBe("09:05");
  });
});

describe("isNewArticle", () => {
  const now = new Date("2026-04-11T00:00:00.000Z").getTime();
  it("公開から24時間未満なら true", () => {
    expect(isNewArticle("2026-04-10T01:00:00.000Z", now)).toBe(true);
  });
  it("24時間以上前なら false", () => {
    expect(isNewArticle("2026-04-10T00:00:00.000Z", now)).toBe(false);
  });
});
