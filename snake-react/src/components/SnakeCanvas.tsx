import Box from "@mui/material/Box";
import React, { useEffect } from "react";
import { Image, Stage, Layer, Rect, Circle, Line } from "react-konva";
import useImage from "use-image";
import { Direction, SnakeAction } from "snake-game/typing";
import { useAppDispatch, useAppSelector } from "../redux/hook";
import { snakeMove } from "../redux/slice/manualSnakeGameSlice";
import food from "./apple-icon.svg";
import type { RootState } from "../redux/store";

const worldWidth = 20;
const worldHeight = 20;
const gridSize = 600 / worldWidth;
const worldBackgroundColor = "#f2f2f2";
const snakeFillColor = "#1aa4f4";
const snakeStrokeColor = "#000000";
const gridStrokeColor = "#00ee00";

const FoodImage = (props: { x: number; y: number }): JSX.Element => {
  const scale = 0.45;
  const [image] = useImage(food);
  return <Image x={props.x} y={props.y} scaleX={scale} scaleY={scale} image={image} />;
};

export const SnakeCanvas = () => {
  const snakePositions = useAppSelector((state: RootState) => state.manualSnakeGame.snakeGame.snake.positions);
  const snakeDirection = useAppSelector((state: RootState) => state.manualSnakeGame.snakeGame.snake.direction);
  const food = useAppSelector((state: RootState) => state.manualSnakeGame.snakeGame.food);
  const gameOver = useAppSelector((state: RootState) => state.manualSnakeGame.snakeGame.gameOver);

  const dispatch = useAppDispatch();
  const move = (snakeAction: SnakeAction) => dispatch(snakeMove(snakeAction));

  useEffect(() => {
    const keydownHandler = (event: KeyboardEvent) => {
      console.log(event.key);
      switch (event.key) {
        case "ArrowUp":
          move(SnakeAction.FRONT);
          break;
        case "ArrowLeft":
          move(SnakeAction.TURN_LEFT);
          break;
        case "ArrowRight":
          move(SnakeAction.TURN_RIGHT);
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", keydownHandler);
    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  });

  // !!! testing
  if (!move) {
    console.log(move);
  }

  // todo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canvasRef = React.useRef<any>(null);

  const Background = () => canvasRef?.current && <Rect x={0} y={0} width={canvasRef.current.width()} height={canvasRef.current.height()} fill={worldBackgroundColor} />;

  const WorldGrid = () => {
    const intervals = Array(worldWidth - 1)
      .fill(0)
      .map((x, idx) => (idx + 1) * gridSize);

    return (
      canvasRef?.current && (
        <>
          {intervals.map((y, idx) => (
            <Line key={idx} points={[0, y, canvasRef.current.width(), y]} stroke={gridStrokeColor} strokeWidth={1} opacity={0.5} />
          ))}
          {intervals.map((x, idx) => (
            <Line key={idx} points={[x, 0, x, canvasRef.current.height()]} stroke={gridStrokeColor} strokeWidth={1} opacity={0.5} />
          ))}
        </>
      )
    );
  };

  return (
    <Box>
      <Box>
        <Stage ref={canvasRef} width={worldWidth * gridSize} height={worldHeight * gridSize}>
          <Layer>
            <Background />
            <WorldGrid />
            {snakePositions.map((p, index) => (
              <Rect key={index} x={p.x * gridSize} y={p.y * gridSize} width={gridSize} height={gridSize} strokeWidth={1} stroke={snakeStrokeColor} fill={snakeFillColor} />
            ))}
            <FoodImage x={food.x * gridSize} y={food.y * gridSize} />
            {snakeEyesPosition(gridSize, snakePositions[0], snakeDirection).map((p, index) => (
              <Circle key={index} x={p.x} y={p.y} radius={gridSize * 0.1} strokeWidth={1} stroke="#000000" fill="#000000" />
            ))}
          </Layer>
        </Stage>
      </Box>
      {gameOver && <Box>Game Over</Box>}
    </Box>
  );
};

interface Position {
  x: number;
  y: number;
}

function snakeEyesPosition(gridSize: number, head: Position, snakeDirection: Direction) {
  const eyePosOffset = gridSize * 0.3;

  const headCX = head.x * gridSize + gridSize / 2;
  const headCY = head.y * gridSize + gridSize / 2;

  let p1x: number;
  let p1y: number;
  let p2x: number;
  let p2y: number;

  switch (snakeDirection) {
    case Direction.UP:
      p1x = headCX - eyePosOffset;
      p1y = headCY - eyePosOffset;
      p2x = headCX + eyePosOffset;
      p2y = headCY - eyePosOffset;
      return [
        { x: p1x, y: p1y },
        { x: p2x, y: p2y },
      ];
    case Direction.DOWN:
      p1x = headCX - eyePosOffset;
      p1y = headCY + eyePosOffset;
      p2x = headCX + eyePosOffset;
      p2y = headCY + eyePosOffset;
      return [
        { x: p1x, y: p1y },
        { x: p2x, y: p2y },
      ];
    case Direction.LEFT:
      p1x = headCX - eyePosOffset;
      p1y = headCY - eyePosOffset;
      p2x = headCX - eyePosOffset;
      p2y = headCY + eyePosOffset;
      return [
        { x: p1x, y: p1y },
        { x: p2x, y: p2y },
      ];
    case Direction.RIGHT:
      p1x = headCX + eyePosOffset;
      p1y = headCY - eyePosOffset;
      p2x = headCX + eyePosOffset;
      p2y = headCY + eyePosOffset;
      return [
        { x: p1x, y: p1y },
        { x: p2x, y: p2y },
      ];
  }
}
