import type { LayerShape } from "./SnakeBrain";

export function generateLayerShape(...args: number[]) {
  const shapes: LayerShape[] = [];
  for (let i = 0; i < args.length - 1; i++) {
    shapes.push([args[i + 1], args[i]]);
  }
  return shapes;
}
