import React from "react";
import { Rect } from "react-konva";

interface Props {
  worldWidth: number;
  worldHeight: number;
  gridSize: number;
  worldBackgroundColor: string;
}

export const Background = React.memo(({ worldWidth, worldHeight, gridSize, worldBackgroundColor }: Props) => {
  console.log("render Background");

  return <Rect x={0} y={0} width={worldWidth * gridSize} height={worldHeight * gridSize} fill={worldBackgroundColor} />;
});
