import React, { useEffect } from "react";
import { Direction } from "snake-game/typing";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { snakeMove } from "../../redux/slice/manualSnakeGameSlice";
import { SnakeGameUi } from "../../components/SnakeGameUi";

export const SnakeGameUiWrapper = () => {
  const dispatch = useAppDispatch();

  const snakeGame = useAppSelector((state) => state.manualSnakeGame.snakeGame);
  const move = (direction: Direction) => dispatch(snakeMove(direction));

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          move(Direction.UP);
          break;
        case "ArrowDown":
          event.preventDefault();
          move(Direction.DOWN);
          break;
        case "ArrowLeft":
          event.preventDefault();
          move(Direction.LEFT);
          break;
        case "ArrowRight":
          event.preventDefault();
          move(Direction.RIGHT);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", keydownHandler);
    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  return <SnakeGameUi snakeGame={snakeGame} />;
};
