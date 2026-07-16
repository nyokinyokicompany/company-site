"use client";

import { useEffect, useState } from "react";

const counterUrl = "https://nyoki-visitor-counter.hyakku1.chatgpt.site/api/visit";
const countedAtKey = "nyoki-visitor-counted-at";
const countingWindowMs = 30 * 60 * 1000;

type VisitorCounts = {
  today: number;
  total: number;
};

let activeRequest: Promise<VisitorCounts> | null = null;

function shouldCountVisit(now: number) {
  try {
    const countedAt = Number(window.localStorage.getItem(countedAtKey));
    return !Number.isFinite(countedAt) || now - countedAt >= countingWindowMs;
  } catch {
    return true;
  }
}

async function requestCounts() {
  const now = Date.now();
  const shouldCount = shouldCountVisit(now);
  const response = await fetch(counterUrl, {
    method: shouldCount ? "POST" : "GET",
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!response.ok) throw new Error("閲覧数を取得できませんでした");

  const data = await response.json();
  const today = Number(data.today);
  const total = Number(data.total);
  if (!Number.isFinite(today) || !Number.isFinite(total)) {
    throw new Error("閲覧数の形式が正しくありません");
  }

  if (shouldCount) {
    try {
      window.localStorage.setItem(countedAtKey, String(now));
    } catch {
      // 保存できないブラウザでも、カウンター表示は続ける
    }
  }

  return { today, total };
}

function loadCounts() {
  activeRequest ??= requestCounts().catch((error) => {
    activeRequest = null;
    throw error;
  });
  return activeRequest;
}

function formatCount(value: number | null) {
  return value === null ? "—" : new Intl.NumberFormat("ja-JP").format(value);
}

export default function VisitorCounter() {
  const [counts, setCounts] = useState<VisitorCounts | null>(null);

  useEffect(() => {
    let isMounted = true;
    loadCounts()
      .then((nextCounts) => {
        if (isMounted) setCounts(nextCounts);
      })
      .catch(() => {
        // 公式サイトの表示を妨げず、次の訪問時に再試行する
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const today = counts?.today ?? null;
  const total = counts?.total ?? null;
  const description = counts
    ? `本日の訪問 ${formatCount(today)}、累計の訪問 ${formatCount(total)}`
    : "訪問数を読み込み中";

  return (
    <span className="visitor-counter" aria-label={description} aria-live="polite">
      <span>TODAY</span>
      <b>{formatCount(today)}</b>
      <i aria-hidden="true">·</i>
      <span>TOTAL</span>
      <b>{formatCount(total)}</b>
    </span>
  );
}
