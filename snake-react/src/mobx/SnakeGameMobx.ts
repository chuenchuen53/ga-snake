import { action, makeAutoObservable, makeObservable, observable } from "mobx";
import SnakeGame from "snake-game/SnakeGame";
import type { Options } from "snake-game/SnakeGame";

class SnakeGameMobx extends SnakeGame {
  constructor(options: Options) {
    super(options);
    makeObservable(this, {
      worldWidth: observable,
      worldHeight: observable,
      gameOver: observable,
      moves: observable,
      movesForNoFood: observable,
      maxTurnOfNoFood: observable,
      snakeMove: action,
    });
    makeAutoObservable(this.snake);
    makeAutoObservable(this.food);
  }
}

export const snakeGameMobx = new SnakeGameMobx({ worldWidth: 20, worldHeight: 20 });
