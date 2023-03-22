import React from "react";
import { GameStatsTable } from "../../components/GameStatsTable";
import { useAppSelector } from "../../redux/hook";


export const GameStatsTableWrapper = () => {
  const snakeLength = useAppSelector(state => state.manualSnakeGame.snakeGame.snake.positions.length);
  const moves = useAppSelector(state => state.manualSnakeGame.snakeGame.moves);
  const movesForNoFood = useAppSelector(state => state.manualSnakeGame.snakeGame.movesForNoFood);
  const maxMovesOfNoFood = useAppSelector(state => state.manualSnakeGame.snakeGame.maxMovesOfNoFood);
  const gameOver = useAppSelector(state => state.manualSnakeGame.snakeGame.gameOver);

  return (
    <GameStatsTable
      snakeLength={snakeLength}
      moves={moves}
      movesForNoFood={movesForNoFood}
      maxMovesOfNoFood={maxMovesOfNoFood}
      gameOver={gameOver}
    />
  );
};
