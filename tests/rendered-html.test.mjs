import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from "node:vm";
import { load } from "js-yaml";

const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
const styles = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");
const miniGame = await readFile(new URL("../app/mini-game.tsx", import.meta.url), "utf8");
const visitorCounter = await readFile(new URL("../app/visitor-counter.tsx", import.meta.url), "utf8");
const news = JSON.parse(await readFile(new URL("../app/news-data.json", import.meta.url), "utf8"));

test("会社名と主要な活動内容が用意されている", () => {
  assert.match(page, /ニョキニョキ/);
  assert.match(page, /ゲーム実況/);
  assert.match(page, /LINEスタンプ/);
});

test("YouTubeとLINE STOREへのリンクが正しい", () => {
  assert.match(page, /youtube\.com\/@hyakku_kuchihate/);
  assert.match(page, /store\.line\.me\/stickershop\/author\/6197622\/ja/);
});

test("YouTubeチャンネル名がニョキニョキチャンネルに統一されている", () => {
  const channelNameMatches = page.match(/ニョキニョキチャンネル/g) ?? [];
  assert.equal(channelNameMatches.length, 2);
  assert.doesNotMatch(page, /ヒャックの.*朽ち果てチャンネル/s);
});

test("YouTubeの公式チャンネル登録ボタンがある", () => {
  assert.match(page, /g-ytsubscribe/);
  assert.match(page, /data-channelid="UC0WeQ11dZOLgP1xM8h24q0w"/);
  assert.match(page, /apis\.google\.com\/js\/platform\.js/);
  assert.match(styles, /\.youtube-subscribe/);
});

test("日本語と共有画像の設定がある", () => {
  assert.match(layout, /<html lang="ja">/);
  assert.match(layout, /\/og\.png/);
});

test("小さい画面向けの表示調整がある", () => {
  assert.match(styles, /@media \(max-width: 560px\)/);
  assert.match(styles, /grid-template-columns: 1fr/);
});

test("会社ロゴがページ上部と下部に表示される", () => {
  const logoMatches = page.match(/\.\/nyokinyoki-company-logo\.png/g) ?? [];
  assert.equal(logoMatches.length, 2);
  assert.match(page, /alt="ニョキニョキカンパニー"/);
  assert.doesNotMatch(page, /next\/image/);
});

test("GitHub Pages向けの静的公開設定がある", async () => {
  const config = await readFile(new URL("../next.config.ts", import.meta.url), "utf8");
  assert.match(config, /output: "export"/);
  assert.match(config, /basePath: isGitHubPages \? "\/company-site"/);
  assert.doesNotMatch(layout, /next\/headers/);
});

test("お問い合わせメールが用意されている", () => {
  const emailLinks = page.match(/mailto:nyokinyokicompany@gmail\.com/g) ?? [];
  assert.equal(emailLinks.length, 2);
  assert.match(page, /メールでお問い合わせ/);
  assert.match(page, />お問い合わせ</);
});

test("YouTubeとLINEスタンプの新着欄がある", () => {
  assert.match(page, /id="news"/);
  assert.match(page, /LATEST NEWS/);
  assert.ok(news.items.some((item) => item.kind === "youtube"));
  assert.ok(news.items.some((item) => item.kind === "line"));
  assert.match(styles, /\.news-grid/);
});

test("AltAltAgentの公開予告欄がある", () => {
  assert.match(page, /id="coming-soon"/);
  assert.match(page, /AltAltAgent/);
  assert.match(page, /AIチャットへ画面を貼り付けるWindowsツール/);
  assert.match(page, /MICROSOFT STORE 公開準備中/);
  assert.match(page, /href="#coming-soon"/);
  assert.match(page, /src="\.\/snap2agent\.ico"/);
  assert.match(styles, /\.coming-soon-card/);
});

test("ミニゲームがページ上部から見つけやすい", () => {
  assert.match(page, /ミニゲームで遊ぶ/);
  assert.ok(page.indexOf('id="game"') < page.indexOf('id="news"'));
  assert.match(styles, /\.button-game/);
});

test("新着の自動更新処理が設定されている", async () => {
  const updater = await readFile(new URL("../scripts/update-news.mjs", import.meta.url), "utf8");
  const workflow = await readFile(new URL("../.github/workflows/update-news.yml", import.meta.url), "utf8");
  assert.match(updater, /feeds\/videos\.xml/);
  assert.match(updater, /stickershop\/author\/6197622/);
  assert.match(workflow, /cron:/);
});

test("新着の自動保存後はpush通知に頼らず公開処理が起動する", async () => {
  const updater = load(await readFile(new URL("../.github/workflows/update-news.yml", import.meta.url), "utf8"));
  const deploy = load(await readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8"));
  assert.ok(updater.on.schedule.length > 0);
  assert.deepEqual(deploy.on.workflow_run?.workflows, [updater.name]);
  assert.deepEqual(deploy.on.workflow_run.types, ["completed"]);
  assert.deepEqual(deploy.on.workflow_run.branches, ["main"]);
});

test("新着取得の成功時だけ公開し通常更新と手動公開も維持する", async () => {
  const deploy = load(await readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8"));
  const condition = deploy.jobs.deploy.if;
  assert.equal(typeof condition, "string");
  // この条件式で使う比較と論理演算はJavaScriptと共通なので、イベント別に実行して確かめる。
  const expression = condition.replace(/^\s*\$\{\{([\s\S]*)\}\}\s*$/, "$1");
  const canDeploy = (eventName, conclusion) => runInNewContext(expression, {
    github: { event_name: eventName, event: { workflow_run: { conclusion } } },
  }, { timeout: 1000 });
  assert.equal(canDeploy("workflow_run", "success"), true);
  for (const conclusion of ["failure", "cancelled", "skipped", "timed_out"]) {
    assert.equal(canDeploy("workflow_run", conclusion), false, conclusion);
  }
  assert.deepEqual(deploy.on.push.branches, ["main"]);
  assert.ok(Object.hasOwn(deploy.on, "workflow_dispatch"));
  assert.equal(canDeploy("push"), true);
  assert.equal(canDeploy("workflow_dispatch"), true);
});

test("公開時は新着保存前の履歴ではなく更新後のmainを取得する", async () => {
  const deploy = load(await readFile(new URL("../.github/workflows/deploy-pages.yml", import.meta.url), "utf8"));
  const checkout = deploy.jobs.deploy.steps.find((step) => step.uses?.startsWith("actions/checkout@"));
  assert.equal(checkout?.with?.ref, "main");
});

test("サイト内でミニゲームを遊べる", () => {
  assert.match(page, /id="game"/);
  assert.match(page, /ニョキっと/);
  assert.match(page, /<MiniGame \/>/);
  assert.match(miniGame, /GAME_DURATION_SECONDS/);
  assert.match(miniGame, /\^\[1-9\]\$/);
  assert.match(styles, /\.game-board/);
});

test("フッターに控えめな本日・累計カウンターがある", () => {
  assert.match(page, /<VisitorCounter \/>/);
  assert.match(visitorCounter, /nyoki-visitor-counter\.hyakku1\.chatgpt\.site\/api\/visit/);
  assert.match(visitorCounter, /TODAY/);
  assert.match(visitorCounter, /TOTAL/);
  assert.match(visitorCounter, /localStorage/);
  assert.match(visitorCounter, /30 \* 60 \* 1000/);
  assert.match(styles, /\.visitor-counter/);
  assert.match(styles, /font-size: 8px/);
});
