import React from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import food from "./assets/apple.svg";

interface Props {
  x: number;
  y: number;
  gridSize: number;
}

const imgSize = 10;
const offset = 5;

export const FoodImage = React.memo(({ x, y, gridSize }: Props): JSX.Element => {
  const [image] = useImage(food);
  const scale = 0.8 * (gridSize / imgSize);
  const halfGridSize = 0.5 * gridSize;
  return <Image x={x * gridSize + halfGridSize} y={y * gridSize + halfGridSize} scaleX={scale} scaleY={scale} offsetX={offset} offsetY={offset} image={image} />;
});
