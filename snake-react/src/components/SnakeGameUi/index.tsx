import React, { createContext } from "react";
import Box from "@mui/material/Box";
import { Layer, Stage } from "react-konva";
import { WorldGrid } from "./WorldGrid";
import { FoodImage } from "./FoodImage";
import { Snake } from "./Snake";
import { Background } from "./Background";
import type { ISnakeGame } from "snake-game/SnakeGame";

const worldBackgroundColor = "#424242";
const snakeFillColor = "#009688";
const snakeStrokeColor = "#000000";
const gridStrokeColor = "#4CAF50";

interface Props {
  snakeGame: ISnakeGame;
}

const SnakeGameUiDimensionsContext = createContext<null | { worldWidth: number; worldHeight: number; gridSize: number }>(null);
console.log("SnakeGameUiDimensionsContext", SnakeGameUiDimensionsContext);

export const SnakeGameUi = ({ snakeGame }: Props) => {
  const worldWidth = snakeGame.worldWidth;
  const worldHeight = snakeGame.worldHeight;
  const gridSize = 600 / Math.max(worldWidth, worldHeight);

  console.log("render SnakeGameUi");

  return (
    <Box>
      <Stage width={worldWidth * gridSize} height={worldHeight * gridSize}>
        <Layer>
          <Background worldWidth={worldWidth} worldHeight={worldHeight} gridSize={gridSize} worldBackgroundColor={worldBackgroundColor} />
          <WorldGrid worldWidth={worldWidth} worldHeight={worldHeight} gridSize={gridSize} gridStrokeColor={gridStrokeColor} />
          <Snake snake={snakeGame.snake} gridSize={gridSize} snakeFillColor={snakeFillColor} snakeStrokeColor={snakeStrokeColor} />
          <FoodImage x={snakeGame.food.x} y={snakeGame.food.y} gridSize={gridSize} />
        </Layer>
      </Stage>
    </Box>
  );
};
