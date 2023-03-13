import React from "react";
import { Circle, Rect } from "react-konva";
import { Direction } from "snake-game/typing";
import type { ISnake } from "snake-game/Snake";
import type { IPosition } from "snake-game/Position";

interface Props {
  snake: ISnake;
  gridSize: number;
  snakeFillColor: string;
  snakeStrokeColor: string;
}

export const Snake = ({ snake, gridSize, snakeFillColor, snakeStrokeColor }: Props) => {
  const snakePositions = snake.positions;
  const snakeDirection = snake.direction;

  console.log("render me ");

  return (
    <>
      {snakePositions.map((p, index) => (
        <Rect key={index} x={p.x * gridSize} y={p.y * gridSize} width={gridSize} height={gridSize} strokeWidth={1} stroke={snakeStrokeColor} fill={snakeFillColor} />
      ))}
      {snakeEyesPosition(gridSize, snakePositions[0], snakeDirection).map((p, index) => (
        <Circle key={index} x={p.x} y={p.y} radius={gridSize * 0.1} strokeWidth={1} stroke="#000000" fill="#000000" />
      ))}
    </>
  );
};

function snakeEyesPosition(gridSize: number, head: IPosition, snakeDirection: Direction) {
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
