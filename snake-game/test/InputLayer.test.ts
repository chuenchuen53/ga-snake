import SnakeGame from "../SnakeGame";
import { Direction } from "../typing";
import InputLayer, { slopeMap4 } from "../InputLayer";

const game1 = new SnakeGame({
  worldWidth: 20,
  worldHeight: 20,
  providedInitialStatus: {
    snake: {
      positions: [{ x: 6, y: 9 }],
      direction: Direction.UP,
    },
    food: { x: 6, y: 8 },
    gameOver: false,
    moves: 0,
    movesForNoFood: 0,
  },
});

const positions2 =
  '[{"x":19,"y":0},{"x":19,"y":1},{"x":19,"y":2},{"x":19,"y":3},{"x":19,"y":4},{"x":19,"y":5},{"x":19,"y":6},{"x":19,"y":7},{"x":19,"y":8},{"x":19,"y":9},{"x":19,"y":10},{"x":18,"y":10},{"x":17,"y":10},{"x":16,"y":10},{"x":15,"y":10},{"x":14,"y":10},{"x":13,"y":10},{"x":12,"y":10},{"x":11,"y":10},{"x":11,"y":9},{"x":11,"y":8},{"x":11,"y":7},{"x":12,"y":7},{"x":12,"y":6},{"x":12,"y":5},{"x":11,"y":5},{"x":10,"y":5},{"x":9,"y":5},{"x":8,"y":5},{"x":7,"y":5},{"x":6,"y":5},{"x":5,"y":5},{"x":4,"y":5},{"x":3,"y":5},{"x":2,"y":5},{"x":1,"y":5},{"x":1,"y":6},{"x":1,"y":7},{"x":1,"y":8},{"x":1,"y":9},{"x":1,"y":10},{"x":1,"y":11},{"x":1,"y":12},{"x":1,"y":13},{"x":1,"y":14},{"x":1,"y":15},{"x":1,"y":16},{"x":1,"y":17},{"x":1,"y":18},{"x":1,"y":19}]';

const game2 = new SnakeGame({
  worldWidth: 20,
  worldHeight: 20,
  providedInitialStatus: {
    snake: {
      positions: JSON.parse(positions2),
      direction: Direction.UP,
    },
    food: { x: 12, y: 2 },
    gameOver: false,
    moves: 1000,
    movesForNoFood: 0,
  },
});

const positions3 =
  '[{ "x": 6, "y": 8 }, { "x": 6, "y": 7 }, { "x": 6, "y": 6 }, { "x": 7, "y": 6 }, { "x": 8, "y": 6 }, { "x": 9, "y": 6 }, { "x": 10, "y": 6 }, { "x": 11, "y": 6 }, { "x": 12, "y": 6 }, { "x": 12, "y": 7 }, { "x": 11, "y": 7 }, { "x": 10, "y": 7 }, { "x": 10, "y": 8 }, { "x": 10, "y": 9 }, { "x": 10, "y": 10 }, { "x": 9, "y": 10 }, { "x": 8, "y": 10 }, { "x": 8, "y": 11 }, { "x": 9, "y": 11 }, { "x": 10, "y": 11 }, { "x": 11, "y": 11 }, { "x": 12, "y": 11 }, { "x": 13, "y": 11 }, { "x": 14, "y": 11 }, { "x": 14, "y": 10 }, { "x": 15, "y": 10 }, { "x": 15, "y": 9 }, { "x": 15, "y": 8 }, { "x": 16, "y": 8 }, { "x": 17, "y": 8 }, { "x": 18, "y": 8 }, { "x": 18, "y": 7 }, { "x": 18, "y": 6 }, { "x": 18, "y": 5 }, { "x": 18, "y": 4 }, { "x": 17, "y": 4 }, { "x": 17, "y": 3 }, { "x": 17, "y": 2 }, { "x": 16, "y": 2 }, { "x": 15, "y": 2 }, { "x": 15, "y": 1 }, { "x": 14, "y": 1 }, { "x": 13, "y": 1 }, { "x": 12, "y": 1 }, { "x": 11, "y": 1 }, { "x": 10, "y": 1 }, { "x": 9, "y": 1 }, { "x": 8, "y": 1 }, { "x": 7, "y": 1 }, { "x": 7, "y": 2 }, { "x": 7, "y": 3 }, { "x": 8, "y": 3 }, { "x": 9, "y": 3 }, { "x": 10, "y": 3 }, { "x": 11, "y": 3 }, { "x": 12, "y": 3 }, { "x": 13, "y": 3 }, { "x": 13, "y": 4 }, { "x": 12, "y": 4 }, { "x": 11, "y": 4 }, { "x": 10, "y": 4 }, { "x": 9, "y": 4 }, { "x": 8, "y": 4 }, { "x": 7, "y": 4 }, { "x": 6, "y": 4 }, { "x": 5, "y": 4 }, { "x": 4, "y": 4 }, { "x": 3, "y": 4 }, { "x": 3, "y": 5 }, { "x": 2, "y": 5 }, { "x": 1, "y": 5 }, { "x": 1, "y": 6 }, { "x": 1, "y": 7 }, { "x": 1, "y": 8 }, { "x": 1, "y": 9 }, { "x": 1, "y": 10 }, { "x": 1, "y": 11 }, { "x": 2, "y": 11 }, { "x": 2, "y": 12 }, { "x": 3, "y": 12 }, { "x": 4, "y": 12 }, { "x": 4, "y": 13 }, { "x": 5, "y": 13 }, { "x": 6, "y": 13 }, { "x": 6, "y": 14 }, { "x": 7, "y": 14 }, { "x": 7, "y": 15 }, { "x": 8, "y": 15 }, { "x": 9, "y": 15 }, { "x": 10, "y": 15 }, { "x": 11, "y": 15 }, { "x": 12, "y": 15 }, { "x": 12, "y": 16 }, { "x": 12, "y": 17 }, { "x": 12, "y": 18 }, { "x": 11, "y": 18 }]';

const game3 = new SnakeGame({
  worldWidth: 20,
  worldHeight: 20,
  providedInitialStatus: {
    snake: {
      positions: JSON.parse(positions3),
      direction: Direction.DOWN,
    },
    food: { x: 15, y: 15 },
    gameOver: false,
    moves: 1800,
    movesForNoFood: 0,
  },
});

const inputLayer1 = new InputLayer(game1);
const inputLayer2 = new InputLayer(game2);
const inputLayer3 = new InputLayer(game3);

describe("InputLayer test suite", () => {
  it("inputLayerLength test", () => {
    expect(inputLayer1.inputLayerLength).toBe(25);
    expect(inputLayer2.inputLayerLength).toBe(25);
    expect(inputLayer3.inputLayerLength).toBe(25);
  });

  describe("foodSnakeOutOfBoundValue test suite", () => {
    describe("slopeMap4 test suite", () => {
      it("game1 test", () => {
        const food = [0, 0, 1, 0];
        const snake = [0, 0, 0, 0];
        const outOfBound = [0, 0, 0, 0];
        const expectedResult = [...food, ...snake, ...outOfBound];

        const result = inputLayer1.foodSnakeOutOfBoundValue(slopeMap4);
        expect(result).toStrictEqual(expectedResult);
      });

      it("game2 test", () => {
        const food = [0, 0, 0, 0];
        const snake = [1, 0, 0, 0];
        const outOfBound = [0, 1, 1, 0];
        const expectedResult = [...food, ...snake, ...outOfBound];

        const result = inputLayer2.foodSnakeOutOfBoundValue(slopeMap4);
        expect(result).toStrictEqual(expectedResult);
      });

      it("game3 test", () => {
        const food = [0, 0, 0, 0];
        const snake = [0, 0, 1, 0];
        const outOfBound = [0, 0, 0, 0];
        const expectedResult = [...food, ...snake, ...outOfBound];

        const result = inputLayer3.foodSnakeOutOfBoundValue(slopeMap4);
        expect(result).toStrictEqual(expectedResult);
      });
    });
  });

  describe("currentDirectionValue test suite", () => {
    it("game1 test", () => {
      expect(inputLayer1.currentDirectionValue()).toStrictEqual([1, 0, 0, 0]);
    });

    it("game2 test", () => {
      expect(inputLayer2.currentDirectionValue()).toStrictEqual([1, 0, 0, 0]);
    });

    it("game3 test", () => {
      expect(inputLayer3.currentDirectionValue()).toStrictEqual([0, 1, 0, 0]);
    });
  });

  describe("foodDistanceValue test suite", () => {
    it("game1 test", () => {
      expect(inputLayer1.foodDistanceValue()).toStrictEqual([1, 0, 0, 0]);
    });

    it("game2 test", () => {
      const result = inputLayer2.foodDistanceValue();
      const expectedResult = [0, 1 / 2, 1 / 7, 0];
      expectedResult.forEach((x, i) => expect(result[i]).toBeCloseTo(x));
    });

    it("game3 test", () => {
      const result = inputLayer3.foodDistanceValue();
      const expectedResult = [0, 1 / 7, 0, 1 / 9];
      expectedResult.forEach((x, i) => expect(result[i]).toBeCloseTo(x));
    });
  });

  describe("snakePortionValue test suite", () => {
    it("game1 test", () => {
      expect(inputLayer1.snakePortionValue()).toStrictEqual([0, 0, 0, 0]);
    });

    it("game2 test", () => {
      const worldSize = 20 * 20;
      const result = inputLayer2.snakePortionValue();
      const expectedResult = [0, 49 / worldSize, 39 / worldSize, 0];
      expectedResult.forEach((x, i) => expect(result[i]).toBeCloseTo(x));
    });

    it("game3 test", () => {
      const worldSize = 20 * 20;
      const result = inputLayer3.snakePortionValue();
      const expectedResult = [53 / worldSize, 36 / worldSize, 18 / worldSize, 72 / worldSize];
      expectedResult.forEach((x, i) => expect(result[i]).toBeCloseTo(x));
    });
  });

  describe("getSnakeLengthWorldRatio test suite", () => {
    it("game1 test", () => {
      expect(inputLayer1.getSnakeLengthWorldRatio()).toBeCloseTo(1 / (20 * 20));
    });

    it("game2 test", () => {
      expect(inputLayer2.getSnakeLengthWorldRatio()).toBeCloseTo(50 / (20 * 20));
    });

    it("game3 test", () => {
      expect(inputLayer3.getSnakeLengthWorldRatio()).toBeCloseTo(96 / (20 * 20));
    });
  });
});
