import React from "react";
import Button from "@mui/material/Button";
import { ManualSnakeGame } from "./components/ManualSnakeGame";
import { useAppDispatch, useAppSelector } from "./redux/hook";
import { changeWorldSize, snakeMove as snakeMoveAction } from "./redux/slice/manualSnakeGameSlice";
import type { Direction } from "snake-game/typing";
import "./App.css";

function App() {
  const dispatch = useAppDispatch();

  const snakeGame = useAppSelector((state) => state.manualSnakeGame.snakeGame);
  const snakeMove = (direction: Direction) => dispatch(snakeMoveAction(direction));

  const changeWorld = () => dispatch(changeWorldSize({ worldWidth: Math.random() < 0.5 ? 10 : 20, worldHeight: Math.random() < 0.5 ? 10 : 20 }));

  return (
    <div className="App">
      <ManualSnakeGame snakeGame={snakeGame} snakeMove={snakeMove} />
      <Button variant="contained" onClick={changeWorld}>
        change world test
      </Button>
    </div>
  );
}

export default App;
