import assert from "node:assert/strict";
import test from "node:test";
import {
  BOARD_SIZE,
  GAME_DURATION_SECONDS,
  getResultMessage,
  pickNextTarget,
} from "../app/mini-game-logic.js";

test("ミニゲームは9マスを20秒で遊べる", () => {
  assert.equal(BOARD_SIZE, 9);
  assert.equal(GAME_DURATION_SECONDS, 20);
});

test("次の芽は直前と違う場所に出る", () => {
  for (let current = 0; current < BOARD_SIZE; current += 1) {
    assert.notEqual(pickNextTarget(current, 0), current);
    assert.notEqual(pickNextTarget(current, 0.999999), current);
  }
});

test("最初の芽は必ずゲーム盤の中に出る", () => {
  assert.equal(pickNextTarget(-1, 0), 0);
  assert.equal(pickNextTarget(-1, 0.999999), BOARD_SIZE - 1);
});

test("得点に合った結果メッセージが返る", () => {
  assert.match(getResultMessage(3), /次はもっと/);
  assert.match(getResultMessage(9), /いい調子/);
  assert.match(getResultMessage(18), /大豊作/);
  assert.match(getResultMessage(25), /名人/);
});
