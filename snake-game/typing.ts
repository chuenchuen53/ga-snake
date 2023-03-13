import type Position from "./Position";

export enum Direction {
  UP = "UP",
  DOWN = "DOWN",
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}

export enum SnakeAction {
  FRONT = "FRONT",
  TURN_LEFT = "TURN_LEFT",
  TURN_RIGHT = "TURN_RIGHT",
}

export interface PositionAndDirection {
  position: Position;
  direction: Direction;
}
