import { readFile, writeFile } from "node:fs/promises";

const channelId = "UC0WeQ11dZOLgP1xM8h24q0w";
const lineAuthorUrl = "https://store.line.me/stickershop/author/6197622/ja";
const outputUrl = new URL("../app/news-data.json", import.meta.url);

function decodeHtml(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { "user-agent": "nyokinyoki-company-site-updater/1.0" },
  });
  if (!response.ok) throw new Error(`${url} の取得に失敗しました: ${response.status}`);
  return response.text();
}

async function fetchYouTubeItems() {
  const xml = await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`);
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 3).map((match) => {
    const entry = match[1];
    const id = entry.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] ?? "";
    const title = decodeHtml(entry.match(/<title>([\s\S]*?)<\/title>/)?.[1] ?? "");
    const published = entry.match(/<published>(.*?)<\/published>/)?.[1] ?? null;
    return {
      id,
      kind: "youtube",
      title,
      url: `https://www.youtube.com/watch?v=${id}`,
      image: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      published,
    };
  }).filter((item) => item.id && item.title);
}

async function fetchLineItems() {
  const html = await fetchText(lineAuthorUrl);
  return [...html.matchAll(/<li class="mdCMN02Li"[^>]*>([\s\S]*?)<\/li>/g)].slice(0, 3).map((match) => {
    const item = match[1];
    const path = item.match(/href="(\/stickershop\/product\/(\d+)\/ja)"/)?.[1] ?? "";
    const id = item.match(/href="\/stickershop\/product\/(\d+)\/ja"/)?.[1] ?? "";
    const title = decodeHtml(item.match(/data-test="item-name">([\s\S]*?)<\/p>/)?.[1]?.trim() ?? "");
    const image = item.match(/src="(https:\/\/stickershop\.line-scdn\.net\/[^\"]+)"/)?.[1] ?? "";
    return {
      id,
      kind: "line",
      title,
      url: `https://store.line.me${path}`,
      image: decodeHtml(image),
      published: null,
    };
  }).filter((item) => item.id && item.title && item.image);
}

const items = [...await fetchYouTubeItems(), ...await fetchLineItems()];
if (!items.some((item) => item.kind === "youtube") || !items.some((item) => item.kind === "line")) {
  throw new Error("YouTubeまたはLINEスタンプの新着を確認できませんでした");
}

const next = `${JSON.stringify({ items }, null, 2)}\n`;
const current = await readFile(outputUrl, "utf8").catch(() => "");
if (current !== next) {
  await writeFile(outputUrl, next, "utf8");
  console.log("新着情報を更新しました");
} else {
  console.log("新しい投稿はありません");
}
