import React, { useEffect } from "react";
import { SnakeAction } from "snake-game/typing";
import { SnakeGameUi } from "./SnakeGameUi";
import type SnakeGame from "snake-game/SnakeGame";

interface Props {
  snakeGame: SnakeGame;
}

export const ManualSnakeGame = ({ snakeGame }: Props) => {
  const snakeMove = (snakeAction: SnakeAction) => snakeGame.snakeMove(snakeAction);

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      console.log(event.key);
      switch (event.key) {
        case "ArrowUp":
          snakeMove(SnakeAction.FRONT);
          break;
        case "ArrowLeft":
          snakeMove(SnakeAction.TURN_LEFT);
          break;
        case "ArrowRight":
          snakeMove(SnakeAction.TURN_RIGHT);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", keydownHandler);
    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  });

  return <SnakeGameUi snakeGame={snakeGame} />;
};
