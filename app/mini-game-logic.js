export const BOARD_SIZE = 9;
export const GAME_DURATION_SECONDS = 20;

/**
 * 直前とは違う場所から、次に芽を出す場所を選ぶ。
 */
export function pickNextTarget(currentTarget, randomValue = Math.random()) {
  const safeRandom = Math.min(Math.max(randomValue, 0), 0.999999);

  if (currentTarget < 0 || currentTarget >= BOARD_SIZE) {
    return Math.floor(safeRandom * BOARD_SIZE);
  }

  const offset = 1 + Math.floor(safeRandom * (BOARD_SIZE - 1));
  return (currentTarget + offset) % BOARD_SIZE;
}

/**
 * 得点に合わせて、遊んだ後のひとことを返す。
 */
export function getResultMessage(score) {
  if (score >= 24) return "すごい！ ニョキニョキ名人です！";
  if (score >= 16) return "大豊作！ たくさん育ちました！";
  if (score >= 8) return "いい調子！ もう一度チャレンジ！";
  return "芽が出てきました。次はもっとニョキニョキ！";
}
