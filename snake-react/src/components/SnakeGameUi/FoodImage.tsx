import React from "react";
import { Image } from "react-konva";
import useImage from "use-image";
import food from "./apple-icon.svg";
import type { IPosition } from "snake-game/Position";

interface Props {
  position: IPosition;
  gridSize: number;
}
const SCALE = 0.45;

export const FoodImage = ({ position, gridSize }: Props): JSX.Element => {
  const [image] = useImage(food);
  return <Image x={position.x * gridSize} y={position.y * gridSize} scaleX={SCALE} scaleY={SCALE} image={image} />;
};
