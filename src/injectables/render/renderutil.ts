import { Configure } from "../configure";

export type RenderData = Position & {
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

export type OptRenderData = Position & Partial<RenderData>;

export type Position = {
  x: number;
  y: number;
};

export function isPosition(pos: any): pos is Position {
  return pos.x !== undefined && pos.y !== undefined;
}

export type Vector = Position;

export type Rect = Position & {
  w: number;
  h: number;
};

export function isRect(rect: any): rect is Rect {
  return (
    rect.x !== undefined &&
    rect.y !== undefined &&
    rect.w !== undefined &&
    rect.h !== undefined
  );
}

export type LinearType = RenderData | Rect | Position;

export function scale(a: RenderData, c: number): RenderData;
export function scale(a: Rect, c: number): Rect;
export function scale(a: Position, c: number): Position;
export function scale(a: LinearType, c: number): LinearType {
  if (isRenderData(a)) {
    return {
      x: c * a.x,
      y: c * a.y,
      rot: c * a.rot,
      scale: c * a.scale,
    };
  } else if (isRect(a)) {
    return { x: c * a.x, y: c * a.y, w: c * a.w, h: c * a.h };
  } else if (isPosition(a)) {
    return { x: c * a.x, y: c * a.y };
  }
  throw new Error("unrecognized LinearType");
}

export function add(a: RenderData, b: RenderData): RenderData;
export function add(a: Rect, b: Rect): Rect;
export function add(a: Position, b: Position): Position;
export function add(a: LinearType, b: LinearType): LinearType {
  if (isRenderData(a) && isRenderData(b)) {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
      rot: a.rot + b.rot,
      scale: a.scale + b.scale,
    };
  } else if (isRect(a) && isRect(b)) {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
      w: a.w + b.w,
      h: a.h + b.h,
    };
  } else if (isPosition(a) && isPosition(b)) {
    return { x: a.x + b.x, y: a.y + b.y };
  }
  throw new Error("mismatched LinearTypes");
}

export function subtract(a: RenderData, b: RenderData): RenderData;
export function subtract(a: Rect, b: Rect): Rect;
export function subtract(a: Position, b: Position): Position;
export function subtract(a: LinearType, b: LinearType): LinearType {
  return add(a, scale(b, -1));
}

export function getCardBoundingBox(rd: RenderData): Rect {
  if (!rd.scale) {
    return { x: 0, y: 0, w: 0, h: 0 };
  }

  const rX = rd.x;
  const rY = rd.y;
  const rW = Configure.CARD_WIDTH;
  const rH = Configure.CARD_HEIGHT;
  const rA = rd.rot;

  const absCosRA = Math.abs(Math.cos(rA));
  const absSinRA = Math.abs(Math.sin(rA));

  let bbW = rW * absCosRA + rH * absSinRA;
  let bbH = rW * absSinRA + rH * absCosRA;

  bbW *= rd.scale;
  bbH *= rd.scale;

  const bbX = rX - (bbW - rW) / 2;
  const bbY = rY - (bbH - rH) / 2;

  return { x: bbX, y: bbY, w: bbW, h: bbH };
}

/**
 * @param scale the maximum absolute value of the noise
 * @returns a random value centered around zero with variance 0.5 * scale^2
 */
export function randNoise(scale: number = 1): number {
  return (Math.random() - Math.random()) * scale;
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export function loadOntoImage(
  img: HTMLImageElement,
  src: string
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    img.onload = () => resolve(true);
    img.onerror = reject;
    img.src = src;
  });
}
