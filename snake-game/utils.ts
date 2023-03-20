type Primitive = number | string | boolean | null;

export type StringBasedEnumMap<EnumMap> = { [P in keyof EnumMap]: EnumMap[P] & string };
export type StringBasedEnumValue<EnumMap> = EnumMap extends StringBasedEnumMap<EnumMap> ? EnumMap[keyof EnumMap] : never;

export class Utils {
  public static enumToArray<EnumMap extends StringBasedEnumMap<EnumMap>>(enumMap: EnumMap): StringBasedEnumValue<EnumMap>[] {
    return Object.values(enumMap);
  }

  public static randomUniform(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }

  public static randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public static randomItemFromArray<T>(array: T[]): T {
    return array[Utils.randomInteger(0, array.length - 1)];
  }

  public static randomItemFromEnum<EnumMap extends StringBasedEnumMap<EnumMap>>(enumMap: EnumMap): StringBasedEnumValue<EnumMap> {
    return Utils.randomItemFromArray(Utils.enumToArray(enumMap));
  }

  /**
   * @param prob 0..1
   **/
  public static randomBool(prob: number): boolean {
    return Math.random() < prob;
  }

  public static clone1dArr<T extends Primitive>(arr: T[]): T[] {
    return arr.slice();
  }

  public static cloneObject<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
