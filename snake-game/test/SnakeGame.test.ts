import { oppositeDirection } from "../oppositeDirection";
import Position from "../Position";
import SnakeGame from "../SnakeGame";
import { Direction, SnakeAction } from "../typing";
import { Utils } from "../utils";

describe("test suite for SnakeGame", () => {
  it("static clone test", () => {
    const options = { worldWidth: 3, worldHeight: 3 };
    const snakeGame = new SnakeGame(options);
    const snakeGameClone = SnakeGame.clone(snakeGame);

    expect(snakeGameClone === snakeGame).toBe(false);
    expect(snakeGameClone).toStrictEqual(snakeGame);
  });

  it("constructor test", () => {
    const snakeGame = new SnakeGame({ worldWidth: 3, worldHeight: 3 });

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
    expect(snakeGame.maxMovesOfNoFood).toBeGreaterThan(0);
  });

  it("constructor test for providedInitialStatus", () => {
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
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill({ move: 0 }),
      },
    });

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
    expect(snakeGame.maxMovesOfNoFood).toBeGreaterThan(0);
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
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill(0),
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
      maxMovesOfNoFood: snakeGame.maxMovesOfNoFood,
      initialSnakePosition: { x: 1, y: 1 },
      initialSnakeDirection: Direction.UP,
      initialFoodPosition: { x: 0, y: 0 },
      moveRecord: new Array(10).fill(0),
    };

    expect(plainObj instanceof SnakeGame).toBe(false);
    expect(plainObj).toStrictEqual(expectedPlainObject);
    expect(JSON.stringify(plainObj)).toBe(JSON.stringify(expectedPlainObject));
  });

  it("reset test", () => {
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
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill({ move: 0 }),
      },
    });
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
    expect(snakeGame.maxMovesOfNoFood).toBeGreaterThan(0);
    expect(snakeGame.initialSnakePosition).toStrictEqual(snakeGame.snake.head.toPlainObject());
    expect(snakeGame.initialSnakeDirection).toBe(snakeGame.snake.direction);
    expect(snakeGame.initialFoodPosition).toStrictEqual(snakeGame.food.toPlainObject());
    expect(snakeGame.moveRecord.length).toBe(0);
  });

  it("suicide test 1", () => {
    const options = { worldWidth: 3, worldHeight: 3 };
    const snakeGame1 = new SnakeGame(options);
    snakeGame1.suicide();
    expect(snakeGame1.moves).toBe(1);
    expect(snakeGame1.movesForNoFood).toBe(1);
    expect(snakeGame1.gameOver).toBe(true);
    expect(snakeGame1.moveRecord.length).toBe(1);
    expect(snakeGame1.moveRecord[0]).toStrictEqual(-1);

    const snakeGame2 = new SnakeGame(options);
    snakeGame2.snakeMoveBySnakeAction(SnakeAction.FRONT);
    const movesForNoFoodBeforeSuicide = snakeGame2.movesForNoFood;
    snakeGame2.suicide();
    expect(snakeGame2.moves).toBe(2);
    expect(snakeGame2.movesForNoFood).toBe(movesForNoFoodBeforeSuicide + 1);
    expect(snakeGame2.gameOver).toBe(true);
    expect(snakeGame2.moveRecord.length).toBe(2);
    expect(snakeGame2.moveRecord[1]).toStrictEqual(-1);
  });

  it("suicide test toThrowError", () => {
    const options = { worldWidth: 3, worldHeight: 3 };
    const snakeGame = new SnakeGame(options);
    snakeGame.suicide();
    expect(snakeGame.gameOver).toBe(true);
    expect(() => snakeGame.suicide()).toThrowError("suicide() is called when game is over");
  });

  it("checkOutOfBounds test 1", () => {
    const snakeGame = new SnakeGame({ worldWidth: 3, worldHeight: 3 });

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
    const snakeGame = new SnakeGame({
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
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill({ move: 0 }),
      },
    });
    getRandomFoodPositionHelper(snakeGame);
  });

  it("getRandomFoodPosition test 3", () => {
    const snakeGame = new SnakeGame({
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
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill({ move: 0 }),
      },
    });
    getRandomFoodPositionHelper(snakeGame);
  });

  it("snakeMoveBySnakeAction test", () => {
    for (const snakeAction of Utils.enumToArray(SnakeAction)) {
      const snakeGame = new SnakeGame({ worldWidth: 5, worldHeight: 5 });
      const getHeadPositionAndDirectionAfterMoveBySnakeActionSpy = jest.spyOn(snakeGame.snake, "getHeadPositionAndDirectionAfterMoveBySnakeAction");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- use type-casting to access the private method
      const snakeMoveSpy = jest.spyOn(snakeGame as any, "snakeMove");

      snakeGame.snakeMoveBySnakeAction(snakeAction);
      expect(getHeadPositionAndDirectionAfterMoveBySnakeActionSpy).toBeCalledWith(snakeAction);
      expect(snakeMoveSpy).toBeCalledTimes(1);
      expect(snakeGame.moveRecord.length).toBe(1);
    }
  });

  it("snakeMoveBySnakeAction test toThrowError", () => {
    const snakeGame = new SnakeGame({ worldWidth: 2, worldHeight: 2 });
    snakeGame.suicide();
    expect(() => snakeGame.snakeMoveBySnakeAction(SnakeAction.FRONT)).toThrowError("snakeMoveBySnakeAction() is called when game is over");
  });

  it("snakeMoveByDirection test", () => {
    const allDirection = Utils.enumToArray(Direction);

    for (const direction of allDirection) {
      const snakeGame = new SnakeGame({
        worldWidth: 5,
        worldHeight: 5,
        providedInitialStatus: {
          snake: {
            positions: [new Position(2, 2)],
            direction: Direction.UP,
          },
          food: new Position(0, 0),
          moves: 0,
          movesForNoFood: 0,
          gameOver: false,
          initialSnakePosition: { x: 1, y: 1 },
          initialSnakeDirection: Direction.UP,
          initialFoodPosition: { x: 0, y: 0 },
          moveRecord: [],
        },
      });

      const getHeadPositionAndDirectionAfterMoveByDirectionSpy = jest.spyOn(snakeGame.snake, "getHeadPositionAndDirectionAfterMoveByDirection");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- use type-casting to access the private method
      const snakeMoveSpy = jest.spyOn(snakeGame as any, "snakeMove");
      const suicideSpy = jest.spyOn(snakeGame, "suicide");

      snakeGame.snakeMoveByDirection(direction);

      if (direction === oppositeDirection(Direction.UP)) {
        expect(getHeadPositionAndDirectionAfterMoveByDirectionSpy).toBeCalledTimes(0);
        expect(snakeMoveSpy).toBeCalledTimes(0);
        expect(suicideSpy).toBeCalledTimes(1);
        expect(snakeGame.moveRecord.length).toBe(1);
      } else {
        expect(getHeadPositionAndDirectionAfterMoveByDirectionSpy).toBeCalledWith(direction);
        expect(snakeMoveSpy).toBeCalledTimes(1);
        expect(suicideSpy).toBeCalledTimes(0);
        expect(snakeGame.moveRecord.length).toBe(1);
      }
    }
  });

  it("snakeMoveByDirection test toThrowError", () => {
    const snakeGame = new SnakeGame({ worldWidth: 2, worldHeight: 2 });
    snakeGame.suicide();
    expect(() => snakeGame.snakeMoveByDirection(Direction.UP)).toThrowError("snakeMoveByDirection() is called when game is over");
  });

  it("snakeMoveByDirectionWithSuicidePrevention test", () => {
    const allDirection = Utils.enumToArray(Direction);

    for (const direction of allDirection) {
      const snakeGame = new SnakeGame({
        worldWidth: 5,
        worldHeight: 5,
        providedInitialStatus: {
          snake: {
            positions: [new Position(2, 2)],
            direction: Direction.UP,
          },
          food: new Position(0, 0),
          moves: 0,
          movesForNoFood: 0,
          gameOver: false,
          initialSnakePosition: { x: 1, y: 1 },
          initialSnakeDirection: Direction.UP,
          initialFoodPosition: { x: 0, y: 0 },
          moveRecord: [],
        },
      });

      const getHeadPositionAndDirectionAfterMoveByDirectionSpy = jest.spyOn(snakeGame.snake, "getHeadPositionAndDirectionAfterMoveByDirection");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- use type-casting to access the private method
      const snakeMoveSpy = jest.spyOn(snakeGame as any, "snakeMove");
      const suicideSpy = jest.spyOn(snakeGame, "suicide");

      snakeGame.snakeMoveByDirectionWithSuicidePrevention(direction);

      if (direction === oppositeDirection(Direction.UP)) {
        expect(getHeadPositionAndDirectionAfterMoveByDirectionSpy).toBeCalledTimes(0);
        expect(snakeMoveSpy).toBeCalledTimes(0);
        expect(suicideSpy).toBeCalledTimes(0);
        expect(snakeGame.moveRecord.length).toBe(0);
      } else {
        expect(getHeadPositionAndDirectionAfterMoveByDirectionSpy).toBeCalledWith(direction);
        expect(snakeMoveSpy).toBeCalledTimes(1);
        expect(suicideSpy).toBeCalledTimes(0);
        expect(snakeGame.moveRecord.length).toBe(1);
      }
    }
  });

  it("snakeMoveByDirectionWithSuicidePrevention test toThrowError", () => {
    const snakeGame = new SnakeGame({ worldWidth: 2, worldHeight: 2 });
    snakeGame.suicide();
    expect(() => snakeGame.snakeMoveByDirectionWithSuicidePrevention(Direction.UP)).toThrowError("snakeMoveByDirectionWithSuicidePrevention() is called when game is over");
  });

  it("snakeMoveBySnakeAction test out of bounds", () => {
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
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill({ move: 0 }),
      },
    });
    snakeGame.snakeMoveBySnakeAction(SnakeAction.FRONT);
    expect(snakeGame.moves).toBe(11);
    expect(snakeGame.movesForNoFood).toBe(3);
    expect(snakeGame.gameOver).toBe(true);
  });

  it("snakeMoveBySnakeAction test eat self", () => {
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
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill({ move: 0 }),
      },
    });
    snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_LEFT);
    expect(snakeGame.moves).toBe(11);
    expect(snakeGame.movesForNoFood).toBe(3);
    expect(snakeGame.gameOver).toBe(true);
  });

  it("snakeMoveBySnakeAction test eat food and reach max length", () => {
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
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill({ move: 0 }),
      },
    });
    snakeGame.snakeMoveBySnakeAction(SnakeAction.TURN_RIGHT);
    expect(snakeGame.moves).toBe(11);
    expect(snakeGame.movesForNoFood).toBe(0);
    expect(snakeGame.gameOver).toBe(true);
    expect(snakeGame.snake.positions.length).toBe(4);
  });

  it("snakeMoveBySnakeAction test exceed maxTurnOfNoFood", () => {
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
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(999).fill({ move: 0 }),
      },
    });
    snakeGame.snakeMoveBySnakeAction(SnakeAction.FRONT);
    expect(snakeGame.moves).toBe(1000);
    expect(snakeGame.movesForNoFood).toBe(1000);
    expect(snakeGame.gameOver).toBe(true);
    expect(snakeGame.snake.positions.length).toBe(1);
  });

  it("moveRecord test 1", () => {
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
        initialSnakePosition: { x: 1, y: 1 },
        initialSnakeDirection: Direction.UP,
        initialFoodPosition: { x: 0, y: 0 },
        moveRecord: new Array(10).fill(0),
      },
    });

    const expectedMoveRecord: number[] = new Array(10).fill(0);

    snakeGame.snakeMoveByDirection(Direction.DOWN); //1,2
    expectedMoveRecord.push(1);
    expect(snakeGame.moveRecord).toStrictEqual(expectedMoveRecord);

    snakeGame.snakeMoveByDirection(Direction.LEFT); //0,2
    expectedMoveRecord.push(2);
    expect(snakeGame.moveRecord).toStrictEqual(expectedMoveRecord);

    snakeGame.snakeMoveByDirection(Direction.UP); //0,1
    expectedMoveRecord.push(0);
    expect(snakeGame.moveRecord).toStrictEqual(expectedMoveRecord);

    snakeGame.snakeMoveByDirection(Direction.RIGHT); //1,1
    expectedMoveRecord.push(3);
    expect(snakeGame.moveRecord).toStrictEqual(expectedMoveRecord);

    snakeGame.snakeMoveByDirection(Direction.UP); //1,0
    expectedMoveRecord.push(0);
    expect(snakeGame.moveRecord).toStrictEqual(expectedMoveRecord);

    snakeGame.snakeMoveByDirection(Direction.LEFT); //0,0 eat food
    const oneDIndex = snakeGame.to1DIndex(snakeGame.food.x, snakeGame.food.y);
    expectedMoveRecord.push((oneDIndex + 1) * 10 + 2);
    expect(snakeGame.moveRecord).toStrictEqual(expectedMoveRecord);

    snakeGame.snakeMoveByDirection(Direction.RIGHT); //suicide
    expectedMoveRecord.push(-1);
    expect(snakeGame.moveRecord).toStrictEqual(expectedMoveRecord);
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
