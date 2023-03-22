import React from "react";
import { GameStatsTable } from "../GameStatsTable";
import { useAppSelector } from "../../redux/hook";

export const GameStatsTableWrapper = () => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- snakeGame will not null if model open
  const snakeGame = useAppSelector((state) => state.snakeBrainExam.snakeGame!);
  const snakeLength = snakeGame.snake.positions.length;
  const { moves, movesForNoFood, maxMovesOfNoFood, gameOver } = snakeGame;

  return <GameStatsTable snakeLength={snakeLength} moves={moves} movesForNoFood={movesForNoFood} maxMovesOfNoFood={maxMovesOfNoFood} gameOver={gameOver} />;
};
