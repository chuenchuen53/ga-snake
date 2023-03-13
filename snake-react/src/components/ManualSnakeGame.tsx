import React, { useEffect } from "react";
import { Direction } from "snake-game/typing";
import { SnakeGameUi } from "./SnakeGameUi";
import type { Action } from "@reduxjs/toolkit";
import type { ISnakeGame } from "snake-game/SnakeGame";

interface Props {
  snakeGame: ISnakeGame;
  snakeMove: (direction: Direction) => Action;
}

export const ManualSnakeGame = ({ snakeGame, snakeMove }: Props) => {
  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          snakeMove(Direction.UP);
          break;
        case "ArrowDown":
          snakeMove(Direction.DOWN);
          break;
        case "ArrowLeft":
          snakeMove(Direction.LEFT);
          break;
        case "ArrowRight":
          snakeMove(Direction.RIGHT);
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
