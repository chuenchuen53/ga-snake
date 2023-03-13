import Position from "../Position";
import SnakeGame from "../SnakeGame";
import { Direction, SnakeAction } from "../typing";

describe("test suite for SnakeGame", () => {
  it("constructor test", () => {
    const options = { worldWidth: 3, worldHeight: 3 };
    const snakeGame = new SnakeGame(options);

    expect(snakeGame.worldWidth).toBe(3);
    expect(snakeGame.worldHeight).toBe(3);
    expect(snakeGame.allPositions).toStrictEqual([
      new Position(0, 0),
      new Position(0, 1),
      new Position(0, 2),
      new Position(1, 0),
      new Position(1, 1),
      new Position(1, 2),
      new Position(2, 0),
      new Position(2, 1),
      new Position(2, 2),
    ]);
    expect(snakeGame.snake.positions.length).toBe(1);
    expect(snakeGame.snake.positions[0].isEqual(new Position(1, 1))).toBe(true);
    expect(snakeGame.food.isEqual(new Position(1, 1))).toBe(false);
    expect(snakeGame.gameOver).toBe(false);
    expect(snakeGame.moves).toBe(0);
    expect(snakeGame.movesForNoFood).toBe(0);
    expect(snakeGame.maxTurnOfNoFood).toBeGreaterThan(0);
  });

  it("constructor test for providedInitialStatus", () => {
    const options = {
      worldWidth: 3,
      worldHeight: 3,
      providedInitialStatus: {
        snake: {
          positions: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 1, y: 2 },
          ],
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 0 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
      },
    };
    const snakeGame = new SnakeGame(options);

    expect(snakeGame.worldWidth).toBe(3);
    expect(snakeGame.worldHeight).toBe(3);
    expect(snakeGame.allPositions).toStrictEqual([
      new Position(0, 0),
      new Position(0, 1),
      new Position(0, 2),
      new Position(1, 0),
      new Position(1, 1),
      new Position(1, 2),
      new Position(2, 0),
      new Position(2, 1),
      new Position(2, 2),
    ]);
    expect(snakeGame.snake.positions.length).toBe(4);
    expect(snakeGame.snake.positions[0].isEqual(new Position(1, 1))).toBe(true);
    expect(snakeGame.snake.positions[1].isEqual(new Position(2, 1))).toBe(true);
    expect(snakeGame.snake.positions[2].isEqual(new Position(2, 2))).toBe(true);
    expect(snakeGame.snake.positions[3].isEqual(new Position(1, 2))).toBe(true);
    expect(snakeGame.food.isEqual(new Position(0, 0))).toBe(true);
    expect(snakeGame.gameOver).toBe(false);
    expect(snakeGame.moves).toBe(10);
    expect(snakeGame.movesForNoFood).toBe(2);
    expect(snakeGame.maxTurnOfNoFood).toBeGreaterThan(0);
  });

  it("toPlainObject test", () => {
    const snakeGame = new SnakeGame({
      worldWidth: 3,
      worldHeight: 3,
      providedInitialStatus: {
        snake: {
          positions: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 1, y: 2 },
          ],
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 0 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
      },
    });
    const plainObj = snakeGame.toPlainObject();

    const expectedPlainObject = {
      worldWidth: 3,
      worldHeight: 3,
      allPositions: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: 2 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 2, y: 0 },
        { x: 2, y: 1 },
        { x: 2, y: 2 },
      ],
      snake: {
        positions: [
          { x: 1, y: 1 },
          { x: 2, y: 1 },
          { x: 2, y: 2 },
          { x: 1, y: 2 },
        ],
        direction: Direction.LEFT,
      },
      food: { x: snakeGame.food.x, y: snakeGame.food.y },
      gameOver: false,
      moves: 10,
      movesForNoFood: 2,
      maxTurnOfNoFood: snakeGame.maxTurnOfNoFood,
    };

    expect(plainObj instanceof SnakeGame).toBe(false);
    expect(plainObj).toStrictEqual(expectedPlainObject);
    expect(JSON.stringify(plainObj)).toBe(JSON.stringify(expectedPlainObject));
  });

  it("reset test", () => {
    const options = {
      worldWidth: 3,
      worldHeight: 3,
      providedInitialStatus: {
        snake: {
          positions: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 1, y: 2 },
          ],
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 0 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
      },
    };
    const snakeGame = new SnakeGame(options);
    snakeGame.reset();
    expect(snakeGame.worldWidth).toBe(3);
    expect(snakeGame.worldHeight).toBe(3);
    expect(snakeGame.allPositions).toStrictEqual([
      new Position(0, 0),
      new Position(0, 1),
      new Position(0, 2),
      new Position(1, 0),
      new Position(1, 1),
      new Position(1, 2),
      new Position(2, 0),
      new Position(2, 1),
      new Position(2, 2),
    ]);
    expect(snakeGame.snake.positions.length).toBe(1);
    expect(snakeGame.snake.positions[0].isEqual(new Position(1, 1))).toBe(true);
    expect(snakeGame.food.isEqual(new Position(1, 1))).toBe(false);
    expect(snakeGame.gameOver).toBe(false);
    expect(snakeGame.moves).toBe(0);
    expect(snakeGame.movesForNoFood).toBe(0);
    expect(snakeGame.maxTurnOfNoFood).toBeGreaterThan(0);
  });

  it("suicide test 1", () => {
    const options = { worldWidth: 3, worldHeight: 3 };
    const snakeGame1 = new SnakeGame(options);
    snakeGame1.suicide();
    expect(snakeGame1.moves).toBe(1);
    expect(snakeGame1.gameOver).toBe(true);

    const snakeGame2 = new SnakeGame(options);
    snakeGame2.snakeMove(SnakeAction.FRONT);
    snakeGame2.suicide();
    expect(snakeGame2.moves).toBe(2);
    expect(snakeGame2.gameOver).toBe(true);
  });

  it("suicide test toThrowError", () => {
    const options = { worldWidth: 3, worldHeight: 3 };
    const snakeGame = new SnakeGame(options);
    snakeGame.suicide();
    expect(snakeGame.gameOver).toBe(true);
    expect(() => snakeGame.suicide()).toThrowError("suicide() is called when game is over");
  });

  it("checkOutOfBounds test 1", () => {
    const options = { worldWidth: 3, worldHeight: 3 };
    const snakeGame = new SnakeGame(options);

    expect(snakeGame.checkOutOfBounds(new Position(-1, 0))).toBe(true);
    expect(snakeGame.checkOutOfBounds(new Position(-1, -1))).toBe(true);
    expect(snakeGame.checkOutOfBounds(new Position(0, -1))).toBe(true);

    expect(snakeGame.checkOutOfBounds(new Position(3, 0))).toBe(true);
    expect(snakeGame.checkOutOfBounds(new Position(3, 3))).toBe(true);
    expect(snakeGame.checkOutOfBounds(new Position(0, 3))).toBe(true);

    expect(snakeGame.checkOutOfBounds(new Position(0, 0))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(0, 1))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(0, 2))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(1, 0))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(1, 1))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(1, 2))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(2, 0))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(2, 1))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(2, 2))).toBe(false);
  });

  it("checkOutOfBounds test 2", () => {
    const options = { worldWidth: 5, worldHeight: 4 };
    const snakeGame = new SnakeGame(options);

    expect(snakeGame.checkOutOfBounds(new Position(-1, 0))).toBe(true);
    expect(snakeGame.checkOutOfBounds(new Position(-1, -1))).toBe(true);
    expect(snakeGame.checkOutOfBounds(new Position(0, -1))).toBe(true);

    expect(snakeGame.checkOutOfBounds(new Position(5, 0))).toBe(true);
    expect(snakeGame.checkOutOfBounds(new Position(5, 4))).toBe(true);
    expect(snakeGame.checkOutOfBounds(new Position(0, 4))).toBe(true);

    expect(snakeGame.checkOutOfBounds(new Position(0, 0))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(0, 1))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(0, 2))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(0, 3))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(1, 0))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(1, 1))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(1, 2))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(1, 3))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(2, 0))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(2, 1))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(2, 2))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(2, 3))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(3, 0))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(3, 1))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(3, 2))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(3, 3))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(4, 0))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(4, 1))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(4, 2))).toBe(false);
    expect(snakeGame.checkOutOfBounds(new Position(4, 3))).toBe(false);
  });

  it("getRandomFoodPosition test 1", () => {
    const snakeGame = new SnakeGame({ worldWidth: 2, worldHeight: 2 });
    getRandomFoodPositionHelper(snakeGame);
  });

  it("getRandomFoodPosition test 2", () => {
    const options = {
      worldWidth: 2,
      worldHeight: 2,
      providedInitialStatus: {
        snake: {
          positions: [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
          ],
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 0 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
      },
    };
    const snakeGame = new SnakeGame(options);
    getRandomFoodPositionHelper(snakeGame);
  });

  it("getRandomFoodPosition test 3", () => {
    const options = {
      worldWidth: 3,
      worldHeight: 2,
      providedInitialStatus: {
        snake: {
          positions: [
            { x: 0, y: 1 },
            { x: 1, y: 1 },
            { x: 1, y: 0 },
          ],
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 0 },
        moves: 10,
        movesForNoFood: 3,
        gameOver: false,
      },
    };
    const snakeGame = new SnakeGame(options);
    getRandomFoodPositionHelper(snakeGame);
  });

  it("snakeMove test 1", () => {
    for (let i = 0; i < 100; i++) {
      const snakeGame = new SnakeGame({ worldWidth: 3, worldHeight: 3 });
      const food = snakeGame.food;
      const headPositionAndDirectionAfterMove = snakeGame.snake.getHeadPositionAndDirectionAfterMove(SnakeAction.FRONT);

      const moveSpy = jest.spyOn(snakeGame.snake, "move");
      const moveWithFoodEatenSpy = jest.spyOn(snakeGame.snake, "moveWithFoodEaten");

      snakeGame.snakeMove(SnakeAction.FRONT);
      if (headPositionAndDirectionAfterMove.position.isEqual(food)) {
        expect(moveSpy).toHaveBeenCalledTimes(0);
        expect(moveWithFoodEatenSpy).toHaveBeenCalledTimes(1);
        expect(moveWithFoodEatenSpy).toHaveBeenCalledWith(headPositionAndDirectionAfterMove);
        expect(snakeGame.movesForNoFood).toBe(0);
      } else {
        expect(moveWithFoodEatenSpy).toHaveBeenCalledTimes(0);
        expect(moveSpy).toHaveBeenCalledTimes(1);
        expect(moveSpy).toHaveBeenCalledWith(headPositionAndDirectionAfterMove);
        expect(snakeGame.movesForNoFood).toBe(1);
      }
      expect(snakeGame.moves).toBe(1);
    }
  });

  it("snakeMove test out of bounds", () => {
    const snakeGame = new SnakeGame({
      worldWidth: 3,
      worldHeight: 3,
      providedInitialStatus: {
        snake: {
          positions: [{ x: 0, y: 0 }],
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 1 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
      },
    });
    snakeGame.snakeMove(SnakeAction.FRONT);
    expect(snakeGame.moves).toBe(11);
    expect(snakeGame.movesForNoFood).toBe(3);
    expect(snakeGame.gameOver).toBe(true);
  });

  it("snakeMove test eat self", () => {
    const snakeGame = new SnakeGame({
      worldWidth: 3,
      worldHeight: 3,
      providedInitialStatus: {
        snake: {
          positions: [
            { x: 1, y: 1 },
            { x: 2, y: 1 },
            { x: 2, y: 2 },
            { x: 1, y: 2 },
            { x: 0, y: 2 },
          ],
          direction: Direction.LEFT,
        },
        food: { x: 0, y: 0 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
      },
    });
    snakeGame.snakeMove(SnakeAction.TURN_LEFT);
    expect(snakeGame.moves).toBe(11);
    expect(snakeGame.movesForNoFood).toBe(3);
    expect(snakeGame.gameOver).toBe(true);
  });

  it("snakeMove test eat food and reach max length", () => {
    const snakeGame = new SnakeGame({
      worldWidth: 2,
      worldHeight: 2,
      providedInitialStatus: {
        snake: {
          positions: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
            { x: 1, y: 1 },
          ],
          direction: Direction.UP,
        },
        food: { x: 1, y: 0 },
        moves: 10,
        movesForNoFood: 2,
        gameOver: false,
      },
    });
    snakeGame.snakeMove(SnakeAction.TURN_RIGHT);
    expect(snakeGame.moves).toBe(11);
    expect(snakeGame.movesForNoFood).toBe(0);
    expect(snakeGame.gameOver).toBe(true);
    expect(snakeGame.snake.positions.length).toBe(4);
  });

  it("snakeMove test exceed maxTurnOfNoFood", () => {
    const snakeGame = new SnakeGame({
      worldWidth: 3,
      worldHeight: 3,
      providedInitialStatus: {
        snake: {
          positions: [{ x: 1, y: 1 }],
          direction: Direction.UP,
        },
        food: { x: 0, y: 0 },
        moves: 999,
        movesForNoFood: 999,
        gameOver: false,
      },
    });
    snakeGame.snakeMove(SnakeAction.FRONT);
    expect(snakeGame.moves).toBe(1000);
    expect(snakeGame.movesForNoFood).toBe(1000);
    expect(snakeGame.gameOver).toBe(true);
    expect(snakeGame.snake.positions.length).toBe(1);
  });

  it("snakeMove test toThrowError", () => {
    const snakeGame = new SnakeGame({ worldWidth: 2, worldHeight: 2 });
    snakeGame.suicide();
    expect(() => snakeGame.snakeMove(SnakeAction.FRONT)).toThrowError("snakeMove() is called when game is over");
  });
});

function getRandomFoodPositionHelper(snakeGame: SnakeGame) {
  const allowAbleDiffRatio = 0.05;
  const simulateTimes = 10000;

  const allowablePositions = snakeGame.allPositions.filter((x) => !snakeGame.snake.positions.some((y) => y.isEqual(x)));
  expect(allowablePositions.length).toBe(snakeGame.allPositions.length - snakeGame.snake.positions.length);
  const countArr = new Array(allowablePositions.length).fill(0);
  for (let i = 0; i < simulateTimes; i++) {
    const foodPosition = snakeGame.getRandomFoodPosition();
    expect(snakeGame.snake.positions.some((p) => p.isEqual(foodPosition))).toBe(false);
    expect(allowablePositions.some((p) => p.isEqual(foodPosition))).toBe(true);
    countArr[allowablePositions.findIndex((p) => p.isEqual(foodPosition))]++;
  }

  const idealAvg = Math.floor(simulateTimes / allowablePositions.length);
  const lowerBound = Math.floor(idealAvg * (1 - allowAbleDiffRatio));
  const upperBound = Math.floor(idealAvg * (1 + allowAbleDiffRatio));
  for (const count of countArr) {
    expect(count).toBeGreaterThanOrEqual(lowerBound);
    expect(count).toBeLessThanOrEqual(upperBound);
  }
}
