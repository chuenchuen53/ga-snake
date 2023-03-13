import React from "react";
import Box from "@mui/material/Box";
import { Layer, Stage } from "react-konva";
import { observer } from "mobx-react";
import { WorldGrid } from "./WorldGrid";
import { FoodImage } from "./FoodImage";
import { Snake } from "./Snake";
import { Background } from "./Background";
import type { ISnakeGame } from "snake-game/SnakeGame";

const worldBackgroundColor = "#f2f2f2";
const snakeFillColor = "#1aa4f4";
const snakeStrokeColor = "#000000";
const gridStrokeColor = "#00ee00";

interface Props {
  snakeGame: ISnakeGame;
}

export const SnakeGameUi = observer(({ snakeGame }: Props) => {
  const worldWidth = snakeGame.worldWidth;
  const worldHeight = snakeGame.worldHeight;
  const gridSize = 600 / worldWidth;

  return (
    <Box>
      <Box>
        <Stage width={worldWidth * gridSize} height={worldHeight * gridSize}>
          <Layer>
            <Background worldWidth={worldWidth} worldHeight={worldHeight} gridSize={gridSize} worldBackgroundColor={worldBackgroundColor} />
            <WorldGrid worldWidth={worldWidth} worldHeight={worldHeight} gridSize={gridSize} gridStrokeColor={gridStrokeColor} />
            <Snake snake={snakeGame.snake} gridSize={gridSize} snakeFillColor={snakeFillColor} snakeStrokeColor={snakeStrokeColor} />
            <FoodImage position={snakeGame.food} gridSize={gridSize} />
          </Layer>
        </Stage>
      </Box>
      moves: {snakeGame.moves}
      {snakeGame.gameOver && <Box>Game Over</Box>}
    </Box>
  );
});
