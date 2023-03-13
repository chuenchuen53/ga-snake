function computeSnakeAction(snakeDirection: Direction, userInputKey: UserInputKey): SnakeAction | null {
  return userInputToActionMap[snakeDirection][userInputKey];
}

export enum UserInputKey {
  ArrowUp = "ArrowUp",
  ArrowDown = "ArrowDown",
  ArrowLeft = "ArrowLeft",
  ArrowRight = "ArrowRight",
}

public nextByUserInput(key: UserInputKey, rejectBackwardMove: boolean = true) {
  const action = computeSnakeAction(this.snake.direction, key);
  if (action) {
    this.next(action);
  } else if (!rejectBackwardMove) {
    this.suicide();
  }
}