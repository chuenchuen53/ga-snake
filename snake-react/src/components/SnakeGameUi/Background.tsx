import React from "react";
import { Rect } from "react-konva";

interface Props {
  worldWidth: number;
  worldHeight: number;
  gridSize: number;
  worldBackgroundColor: string;
}

export const Background = ({ worldWidth, worldHeight, gridSize, worldBackgroundColor }: Props) => {
  return <Rect x={0} y={0} width={worldWidth * gridSize} height={worldHeight * gridSize} fill={worldBackgroundColor} />;
};
