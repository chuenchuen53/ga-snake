import React, { useEffect } from "react";
import Button from "@mui/material/Button";
import { Direction } from "snake-game/typing";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { changeWorldSize, setWorldHeight, setWorldWidth, snakeMove as move } from "../../redux/slice/manualSnakeGameSlice";
import { SnakeGameUi } from "../../components/SnakeGameUi";
import { GameStatsTable } from "./GameStatsTable";

export const PlayPage = () => {
  const worldWidth = useAppSelector((state) => state.manualSnakeGame.worldWidth);
  const worldHeight = useAppSelector((state) => state.manualSnakeGame.worldHeight);
  const dispatch = useAppDispatch();

  const snakeGame = useAppSelector((state) => state.manualSnakeGame.snakeGame);
  const snakeMove = (direction: Direction) => dispatch(move(direction));

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      console.log(event.key);
      switch (event.key) {
        case "ArrowUp":
          event.preventDefault();
          snakeMove(Direction.UP);
          break;
        case "ArrowDown":
          event.preventDefault();
          snakeMove(Direction.DOWN);
          break;
        case "ArrowLeft":
          event.preventDefault();
          snakeMove(Direction.LEFT);
          break;
        case "ArrowRight":
          event.preventDefault();
          snakeMove(Direction.RIGHT);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", keydownHandler);
    console.log("did mount");
    return () => {
      window.removeEventListener("keydown", keydownHandler);
      console.log("did unmount");
    };
  }, []);

  return (
    <div className="App">
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <SnakeGameUi snakeGame={snakeGame} />
        <Box>
          <Box sx={{ "& > :not(style)": { m: 1 } }}>
            <TextField required label="width" variant="outlined" type="number" value={worldWidth} onChange={(e) => dispatch(setWorldWidth(parseInt(e.target.value)))} sx={{ width: 100 }} />
            <TextField required label="height" variant="outlined" type="number" value={worldHeight} onChange={(e) => dispatch(setWorldHeight(parseInt(e.target.value)))} sx={{ width: 100 }} />
            <Button variant="contained" onClick={() => dispatch(changeWorldSize())} sx={{ height: "56px" }}>
              New Game
            </Button>
          </Box>
          <GameStatsTable
            snakeLength={snakeGame.snake.positions.length}
            moves={snakeGame.moves}
            movesForNoFood={snakeGame.movesForNoFood}
            maxMovesOfNoFood={snakeGame.maxMovesOfNoFood}
            gameOver={snakeGame.gameOver}
          />
        </Box>
      </Box>
    </div>
  );
};
