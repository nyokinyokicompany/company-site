"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  BOARD_SIZE,
  GAME_DURATION_SECONDS,
  getResultMessage,
  pickNextTarget,
} from "./mini-game-logic.js";

const BEST_SCORE_KEY = "nyokinyoki-mini-game-best";

type GameStatus = "ready" | "playing" | "finished";

export default function MiniGame() {
  const [status, setStatus] = useState<GameStatus>("ready");
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION_SECONDS);
  const [activeTarget, setActiveTarget] = useState(-1);

  const playingRef = useRef(false);
  const scoreRef = useRef(0);
  const timeLeftRef = useRef(GAME_DURATION_SECONDS);
  const activeTargetRef = useRef(-1);

  useEffect(() => {
    const savedScore = Number(window.localStorage.getItem(BEST_SCORE_KEY));
    if (Number.isFinite(savedScore) && savedScore > 0) {
      setBestScore(savedScore);
    }
  }, []);

  const moveTarget = useCallback(() => {
    const nextTarget = pickNextTarget(activeTargetRef.current, Math.random());
    activeTargetRef.current = nextTarget;
    setActiveTarget(nextTarget);
  }, []);

  const hitTarget = useCallback((index: number) => {
    if (!playingRef.current || activeTargetRef.current !== index) return;

    const nextScore = scoreRef.current + 1;
    scoreRef.current = nextScore;
    setScore(nextScore);

    setBestScore((currentBest) => {
      const nextBest = Math.max(currentBest, nextScore);
      if (nextBest !== currentBest) {
        window.localStorage.setItem(BEST_SCORE_KEY, String(nextBest));
      }
      return nextBest;
    });

    moveTarget();
  }, [moveTarget]);

  useEffect(() => {
    const handleNumberKey = (event: KeyboardEvent) => {
      if (/^[1-9]$/.test(event.key)) {
        hitTarget(Number(event.key) - 1);
      }
    };

    window.addEventListener("keydown", handleNumberKey);
    return () => window.removeEventListener("keydown", handleNumberKey);
  }, [hitTarget]);

  useEffect(() => {
    if (status !== "playing") return;

    const targetTimer = window.setInterval(moveTarget, 650);
    const countdownTimer = window.setInterval(() => {
      const nextTime = Math.max(0, timeLeftRef.current - 1);
      timeLeftRef.current = nextTime;
      setTimeLeft(nextTime);

      if (nextTime === 0) {
        playingRef.current = false;
        activeTargetRef.current = -1;
        setActiveTarget(-1);
        setStatus("finished");
      }
    }, 1000);

    return () => {
      window.clearInterval(targetTimer);
      window.clearInterval(countdownTimer);
    };
  }, [moveTarget, status]);

  const startGame = () => {
    scoreRef.current = 0;
    timeLeftRef.current = GAME_DURATION_SECONDS;
    playingRef.current = true;
    setScore(0);
    setTimeLeft(GAME_DURATION_SECONDS);
    setStatus("playing");
    moveTarget();
  };

  const message = status === "finished"
    ? getResultMessage(score)
    : status === "playing"
      ? "出てきた芽をすばやくタッチ！"
      : "準備ができたら、あそぶを押してね。";

  return (
    <div className="game-shell">
      <div className="game-stats" aria-live="polite">
        <div><span>TIME</span><strong>{timeLeft}</strong><small>秒</small></div>
        <div><span>SCORE</span><strong>{score}</strong><small>本</small></div>
        <div><span>BEST</span><strong>{bestScore}</strong><small>本</small></div>
      </div>

      <div className="game-board" aria-label="ニョキっとタッチのゲーム盤">
        {Array.from({ length: BOARD_SIZE }, (_, index) => {
          const isActive = status === "playing" && activeTarget === index;
          return (
            <button
              className={`game-hole${isActive ? " is-active" : ""}`}
              type="button"
              key={index}
              onClick={() => hitTarget(index)}
              disabled={status !== "playing"}
              aria-label={isActive ? `${index + 1}番の芽をタッチ` : `${index + 1}番の空き地`}
            >
              <span className="hole-number" aria-hidden="true">{index + 1}</span>
              {isActive && <span className="game-sprout" aria-hidden="true">🌱</span>}
            </button>
          );
        })}
      </div>

      <div className="game-controls">
        <p className={`game-message ${status}`} aria-live="polite">{message}</p>
        <button className="game-start" type="button" onClick={startGame} disabled={status === "playing"}>
          {status === "finished" ? "もう一回！" : status === "playing" ? "プレイ中！" : "あそぶ！"}
        </button>
      </div>
    </div>
  );
}
