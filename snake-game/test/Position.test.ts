import Position from "../Position";

describe("test suite for Position", () => {
  it("fromPlainObj test", () => {
    const plainObj = { x: 1, y: 2 };
    const position = Position.fromPlainObj(plainObj);
    expect(position instanceof Position).toBe(true);
    expect(position.x).toBe(1);
    expect(position.y).toBe(2);
    expect(typeof position.isEqual(new Position(0, 0))).toBe("boolean");
  });

  it("isEqual test 1", () => {
    const position = new Position(1, 2);
    expect(position.isEqual(new Position(1, 2))).toBe(true);
    expect(position.isEqual(new Position(1, 3))).toBe(false);
  });

  it("isEqual test 2", () => {
    const position = new Position(5, 3);
    expect(position.isEqual(new Position(5, 3))).toBe(true);
    expect(position.isEqual(new Position(1, 3))).toBe(false);
  });
});
