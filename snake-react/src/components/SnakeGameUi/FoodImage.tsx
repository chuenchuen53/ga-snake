import React from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import food from "./apple-icon.svg";

interface Props {
  x: number;
  y: number;
  gridSize: number;
}

const SCALE = 0.45;

export const FoodImage = React.memo(({ x, y, gridSize }: Props): JSX.Element => {
  console.log("render food");
  const [image] = useImage(food);
  return <Image x={x * gridSize} y={y * gridSize} scaleX={SCALE} scaleY={SCALE} image={image} />;
});
