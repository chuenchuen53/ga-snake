import React from "react";
import { Line } from "react-konva";

interface Props {
  worldWidth: number;
  worldHeight: number;
  gridSize: number;
  gridStrokeColor: string;
}

export const WorldGrid = React.memo(({ worldWidth, worldHeight, gridSize, gridStrokeColor }: Props) => {
  const xLines = Array(worldHeight - 1)
    .fill(0)
    .map((x, idx) => (idx + 1) * gridSize);
  const yLines = Array(worldWidth - 1)
    .fill(0)
    .map((x, idx) => (idx + 1) * gridSize);

  const maxWidth = worldWidth * gridSize;
  const maxHeight = worldHeight * gridSize;

  console.log("render WorldGrid");

  return (
    <>
      {xLines.map((y, idx) => (
        <Line key={idx} points={[0, y, maxWidth, y]} stroke={gridStrokeColor} strokeWidth={1} opacity={0.5} />
      ))}
      {yLines.map((x, idx) => (
        <Line key={idx} points={[x, 0, x, maxHeight]} stroke={gridStrokeColor} strokeWidth={1} opacity={0.5} />
      ))}
    </>
  );
});
