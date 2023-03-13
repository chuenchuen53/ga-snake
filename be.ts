const ActionCodeMap = Object.freeze({
  [SnakeAction.FRONT]: 0,
  [SnakeAction.TURN_LEFT]: 1,
  [SnakeAction.TURN_RIGHT]: 2,
});

const ReverseActionCodeMap = Object.freeze({
  0: SnakeAction.FRONT,
  1: SnakeAction.TURN_LEFT,
  2: SnakeAction.TURN_RIGHT,
});

interface GameRecordBase {
  dimension: { worldWidth: number; worldHeight: number };
  initialCondition: { snake: Snake; food: Position };
}
export interface GameRecord extends GameRecordBase {
  moves: Move[];
}

type EncodedMove = [number] | [number, number, number];

interface EncodedDbMove {
  moves: number[];
  foods: number[];
}
export interface ExportedGameRecord extends GameRecordBase {
  moves: EncodedMove[];
}

export interface ExportedDbGameRecord extends GameRecordBase {
  moves: EncodedDbMove;
}

public nextReplay(move: EncodedMove) {
    const { action, food } = this.decodeMoves([move])[0];
    this.next(action);

    if (food) {
      this.food = food;
    }
  }

  public encodeDbMoves(encodedMoves: EncodedMove[]): EncodedDbMove {
    const moves = encodedMoves.map((x) => (x.length === 3 ? 10 + x[0] : x[0]));
    const foods = encodedMoves.filter((x) => x.length === 3).flatMap((x: [number, number, number]) => [x[1], x[2]]);
    return { moves, foods };
  }

  public decodeDdbMoves(encodedDbMoves: EncodedDbMove): EncodedMove[] {
    const foodsClone = encodedDbMoves.foods;
    const moves: EncodedMove[] = encodedDbMoves.moves.map((x) => {
      if (x >= 10) {
        return [x - 10, foodsClone.shift() ?? 0, foodsClone.shift() ?? 0] as [number, number, number];
      } else {
        return [x] as [number];
      }
    });
    return moves;
  }

  public exportEncodedGameRecord(): string {
    const clonedObj = utils.cloneObject(this.gameRecord);
    const result: ExportedDbGameRecord = { ...clonedObj, moves: this.encodeDbMoves(this.encodeMoves()) };
    return JSON.stringify(result);
  }
