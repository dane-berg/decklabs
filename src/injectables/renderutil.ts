import { Card } from "./card";
import { Configure } from "./configure";

export type Position = {
  x: number;
  y: number;
};

export function drawCard(
  ctx: CanvasRenderingContext2D,
  card: Card,
  x: number,
  y: number,
  scale: number = 1.0
) {
  ctx.drawImage(
    card.img,
    x,
    y,
    Configure.CARD_WIDTH * scale,
    Configure.CARD_HEIGHT * scale
  );
}

export type RenderData = {
  x: number;
  y: number;
  rot: number;
  scale: number;
};

export function isRenderData(rd: any): rd is RenderData {
  return (
    rd.x !== undefined &&
    rd.y !== undefined &&
    rd.rot !== undefined &&
    rd.scale !== undefined
  );
}

export function add(a: RenderData, b: RenderData) {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
    rot: a.rot + b.rot,
    scale: a.scale + b.scale,
  };
}

export function scale(a: RenderData, c: number) {
  return {
    x: c * a.x,
    y: c * a.y,
    rot: c * a.rot,
    scale: c * a.scale,
  };
}

/**
 * @param scale the maximum absolute value of the noise
 * @returns a random value centered around zero with variance 0.5 * scale^2
 */
export function randNoise(scale: number = 1): number {
  return (Math.random() - Math.random()) * scale;
}
