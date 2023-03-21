import { describe, expect, it } from "@jest/globals";
import Position from "../Position";
import type { IPosition } from "../Position";

describe("test suite for Position", () => {
  it("fromPlainObj test", () => {
    const plainObj = { x: 1, y: 2 };
    const position = Position.fromPlainObj(plainObj);
    expect(position instanceof Position).toBe(true);
    expect(position.x).toBe(1);
    expect(position.y).toBe(2);
  });

  it("toPlainObject test", () => {
    const position = new Position(1, 2);
    const plainObj = position.toPlainObject();
    expect(plainObj instanceof Position).toBe(false);
    expect(plainObj).toStrictEqual({ x: 1, y: 2 });
    expect(JSON.stringify(plainObj)).toBe(JSON.stringify({ x: 1, y: 2 }));
  });

  it.each<{ name: string; positionData: IPosition; otherPositionData: IPosition; expected: boolean }>`
    name        | positionData      | otherPositionData | expected
    ${"test 1"} | ${{ x: 1, y: 2 }} | ${{ x: 1, y: 2 }} | ${true}
    ${"test 2"} | ${{ x: 1, y: 2 }} | ${{ x: 1, y: 3 }} | ${false}
    ${"test 3"} | ${{ x: 5, y: 3 }} | ${{ x: 5, y: 3 }} | ${true}
    ${"test 4"} | ${{ x: 5, y: 3 }} | ${{ x: 1, y: 3 }} | ${false}
  `("isEqual $name", ({ positionData, otherPositionData, expected }) => {
    const position = new Position(positionData.x, positionData.y);
    const otherPosition = new Position(otherPositionData.x, otherPositionData.y);
    expect(position.isEqual(otherPosition)).toBe(expected);
  });
});
