import { Canvas } from "./canvas";
import { Rect, Position, Vector, subtract, RenderData } from "./renderutil";

export enum ZIndex {
  NonInteractive = 0,
  Background = 1,
  CastCard = 2,
  HandCard = 3,
  Selection = 4,
}

export class CanvasElement {
  public children: CanvasElement[] = [];
  public parent?: CanvasElement; // only the CanvasEventHandler should ever use this

  constructor(
    protected _rd: RenderData = { x: 0, y: 0, w: 0, h: 0, rot: 0, scale: 1 },
    protected _zIndex: number = ZIndex.NonInteractive
  ) {
    Canvas.register(this);
  }

  public get rd(): RenderData {
    return this._rd;
  }
  public set rd(rd: RenderData) {
    this._rd = rd;
  }

  public get zIndex(): number {
    return this._zIndex;
  }
  public set zIndex(zIndex: number) {
    if (zIndex !== this._zIndex) {
      Canvas.updateZIndex(this, zIndex);
      this._zIndex = zIndex;
    }
  }

  public draw(_ctx: CanvasRenderingContext2D) {}

  // do not override
  public transform(pos: Position): Vector {
    // TODO: account for scale & rotation
    return subtract(this.parent ? this.parent.transform(pos) : pos, this.rd);
  }

  public contains(pos: Position): boolean {
    const diff: Vector = this.transform(pos);
    // a width or height of zero should always return false
    return (
      0 <= diff.x && diff.x < this.rd.w && 0 <= diff.y && diff.y < this.rd.h
    );
  }

  public handleMouseEnter(_pos: Position): void | Promise<void> {}
}

export abstract class RootElement extends CanvasElement {
  public abstract update(rect: Rect): void;
}
