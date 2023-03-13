import React from "react";
import "./App.css";
import SnakeGame from "snake-game/SnakeGame";
import { SnakeCanvas } from "./components/SnakeCanvas";

const snakeGame = new SnakeGame({
  worldWidth: 10,
  worldHeight: 10,
});

function App() {
  console.log(snakeGame);

  return (
    <div className="App">
      <SnakeCanvas />
    </div>
  );
}

export default App;
