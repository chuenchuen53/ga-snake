import React from "react";
import { SnakeGameUi } from "../SnakeGameUi";
import { useAppSelector } from "../../redux/hook";

export const SnakeGameUiWrapper = () => {
  const snakeGame = useAppSelector((state) => state.snakeBrainExam.snakeGame);

  return snakeGame && <SnakeGameUi snakeGame={snakeGame} />;
};
