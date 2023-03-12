type Primitive = number | string | boolean | null;

export type StringBasedEnumMap<EnumMap> = { [P in keyof EnumMap]: EnumMap[P] & string };
export type StringBasedEnumValue<EnumMap> = EnumMap extends StringBasedEnumMap<EnumMap> ? EnumMap[keyof EnumMap] : never;

function enumToArray<EnumMap extends StringBasedEnumMap<EnumMap>>(enumMap: EnumMap): StringBasedEnumValue<EnumMap>[] {
  return Object.values(enumMap);
}

function randomUniform(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItemFromArray<T>(array: T[]): T {
  return array[randomInteger(0, array.length - 1)];
}

function randomItemFromEnum<EnumMap extends StringBasedEnumMap<EnumMap>>(enumMap: EnumMap): StringBasedEnumValue<EnumMap> {
  return randomItemFromArray(enumToArray(enumMap));
}

/**
 * @param prob 0..1
 **/
function randomBool(prob: number): boolean {
  return Math.random() < prob;
}

function clone1dArr<T extends Primitive>(arr: T[]): T[] {
  return arr.slice();
}

function clone2dArr<T extends Primitive>(arr: T[][]): T[][] {
  return arr.map((row) => row.slice());
}

function cloneOneLayerObject<T extends Record<keyof T, Primitive>>(obj: T): T {
  return { ...obj };
}

// function cloneTwoLayerObject(obj: any): any {
function cloneTwoLayerObject<T extends Record<keyof T, Primitive | Record<string, Primitive>>>(obj: T): T {
  const objClone: any = {};
  for (const key of Object.keys(obj)) {
    if ((typeof obj[key] as any) === "object") {
      objClone[key] = { ...obj[key] };
    } else {
      objClone[key] = obj[key];
    }
  }
  return objClone;
}

function cloneObject<T>(obj: T): T {
  const objClone = JSON.parse(JSON.stringify(obj));
  return objClone;
}

function cloneReadonlyObject<T>(obj: T): Readonly<T> {
  const objClone = Object.freeze(cloneObject(obj));
  return objClone;
}

function getArrShape(arr: any, shape: number[]): number[] {
  const shapeClone = shape.slice();

  if (Array.isArray(arr)) {
    shapeClone.push(arr.length);
    return getArrShape(arr[0], shapeClone);
  } else {
    return shapeClone;
  }
}

function padTo2Digits(num: number): string {
  return num.toString().padStart(2, "0");
}

function formatDateTime(date: Date) {
  return (
    [date.getFullYear(), padTo2Digits(date.getMonth() + 1), padTo2Digits(date.getDate())].join("") +
    "-" +
    [padTo2Digits(date.getHours()), padTo2Digits(date.getMinutes()), padTo2Digits(date.getSeconds())].join("")
  );
}

export const utils = Object.freeze({
  enumToArray,
  randomUniform,
  randomInteger,
  randomItemFromArray,
  randomItemFromEnum,
  randomBool,
  clone1dArr,
  clone2dArr,
  cloneOneLayerObject,
  cloneTwoLayerObject,
  cloneObject,
  cloneReadonlyObject,
  getArrShape,
  padTo2Digits,
  formatDateTime,
});
