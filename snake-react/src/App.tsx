import React from "react";
import { ManualSnakeGame } from "./components/ManualSnakeGame";
import { snakeGameMobx } from "./mobx/SnakeGameMobx";
import "./App.css";

function App() {
  return (
    <div className="App">
      <ManualSnakeGame snakeGame={snakeGameMobx} />
    </div>
  );
}

export default App;
