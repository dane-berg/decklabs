import { Configure } from "../configure";
import { CanvasElement } from "./canvaselement";

export type RenderData = TransformData & Rect;

export function isRenderData(rd: any): rd is RenderData {
  return (
    rd.x !== undefined &&
    rd.y !== undefined &&
    rd.w !== undefined &&
    rd.h !== undefined &&
    rd.rot !== undefined &&
    rd.scale !== undefined
  );
}

export type TransformData = Position & {
  rot: number;
  scale: number;
};

export function isTransformData(td: any): td is TransformData {
  return (
    td.x !== undefined &&
    td.y !== undefined &&
    td.rot !== undefined &&
    td.scale !== undefined
  );
}

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

export type LinearType = RenderData | TransformData | Rect | Position;

export function scale(a: RenderData, c: number): RenderData;
export function scale(a: TransformData, c: number): TransformData;
export function scale(a: Rect, c: number): Rect;
export function scale(a: Position, c: number): Position;
export function scale(a: LinearType, c: number): LinearType {
  if (isRenderData(a)) {
    return {
      x: c * a.x,
      y: c * a.y,
      w: c * a.w,
      h: c * a.h,
      rot: c * a.rot,
      scale: c * a.scale,
    };
  } else if (isTransformData(a)) {
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
export function add(a: TransformData, b: TransformData): TransformData;
export function add(a: Rect, b: Rect): Rect;
export function add(a: Position, b: Position): Position;
export function add(a: LinearType, b: LinearType): LinearType {
  if (isRenderData(a) && isRenderData(b)) {
    return {
      x: a.x + b.x,
      y: a.y + b.y,
      w: a.w + b.w,
      h: a.h + b.h,
      rot: a.rot + b.rot,
      scale: a.scale + b.scale,
    };
  } else if (isTransformData(a) && isTransformData(b)) {
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
export function subtract(a: TransformData, b: TransformData): TransformData;
export function subtract(a: Rect, b: Rect): Rect;
export function subtract(a: Position, b: Position): Position;
export function subtract(a: LinearType, b: LinearType): LinearType {
  return add(a, scale(b, -1));
}

export function getCardBoundingBox(td: TransformData): Rect {
  if (!td.scale) {
    return { x: 0, y: 0, w: 0, h: 0 };
  }

  const rX = td.x;
  const rY = td.y;
  const rW = Configure.CARD_WIDTH;
  const rH = Configure.CARD_HEIGHT;
  const rA = td.rot;

  const absCosRA = Math.abs(Math.cos(rA));
  const absSinRA = Math.abs(Math.sin(rA));

  let bbW = rW * absCosRA + rH * absSinRA;
  let bbH = rW * absSinRA + rH * absCosRA;

  bbW *= td.scale;
  bbH *= td.scale;

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
  src: string | File
): Promise<boolean> {
  if (typeof src === "string") {
    return new Promise((resolve, reject) => {
      img.onload = () => resolve(true);
      img.onerror = reject;
      img.src = src;
    });
  } else {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () =>
        resolve(loadOntoImage(img, reader.result as string));
      reader.onerror = reject;
      reader.readAsDataURL(src);
    });
  }
}

export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  font: string = Configure.card_font,
  fillstyle: string = "black"
) {
  wrapTextLines(ctx, [text], x, y, maxWidth, lineHeight, font, fillstyle);
}

export function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  textLines: string[],
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  font: string = Configure.card_font,
  fillstyle: string = "black"
) {
  ctx.font = `${lineHeight}px ${font}`;
  ctx.fillStyle = fillstyle;
  for (const text of textLines) {
    const words = text.split(" ");
    let line = "";

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + " ";
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + " ";
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }
}

export function withEvenSpacing<T>(
  thisElement: CanvasElement,
  arr: T[],
  minTotalMargin: number,
  itemWidth: number,
  update: (item: T, xPos: number, index: number) => void
) {
  const totalWidth = Math.min(
    thisElement.rd.w - minTotalMargin,
    (arr.length - 1) * itemWidth
  );
  const leftX = (thisElement.rd.w - totalWidth) / 2;
  arr.forEach((item: T, index: number) => {
    let dx = (index * totalWidth) / (arr.length - 1);
    if (arr.length === 1) {
      dx = 0;
    }
    update(item, leftX + dx, index);
  });
}
