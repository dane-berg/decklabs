import { CanvasEventHandler } from "./canvaseventhandler";
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
    protected _rect: Rect = { x: 0, y: 0, w: 0, h: 0 },
    protected _zIndex: number = ZIndex.NonInteractive
  ) {
    CanvasEventHandler.register(this);
  }

  public set rect(rect: Rect) {
    this._rect = rect;
  }
  public get rect(): Rect {
    return this._rect;
  }

  public set zIndex(zIndex: number) {
    if (zIndex !== this._zIndex) {
      CanvasEventHandler.updateZIndex(this, zIndex);
      this._zIndex = zIndex;
    }
  }
  public get zIndex(): number {
    return this._zIndex;
  }

  public getRenderData(): RenderData {
    return { x: this.rect.x, y: this.rect.y, rot: 0, scale: 1 };
  }

  public draw(_ctx: CanvasRenderingContext2D) {}

  // TODO: move these two methods to CanvasEventHandler instead
  // do not override
  public render(ctx: CanvasRenderingContext2D) {
    const { x, y, rot, scale } = this.getRenderData();
    ctx.save();
    ctx.translate(x, y);
    if (rot) {
      ctx.rotate(rot);
    }
    if (scale !== 1) {
      ctx.scale(scale, scale);
    }
    if (this.rect.w && this.rect.h) {
      this.draw(ctx);
    }
    this.children.forEach((child) => child.render(ctx));
    ctx.restore();
  }

  // do not override
  public transform(pos: Position): Vector {
    // TODO: account for scale & rotation
    return subtract(
      this.parent ? this.parent.transform(pos) : pos,
      this.getRenderData()
    );
  }

  public contains(pos: Position): boolean {
    const diff: Vector = this.transform(pos);
    // a width or height of zero should always return false
    return (
      0 <= diff.x && diff.x < this.rect.w && 0 <= diff.y && diff.y < this.rect.h
    );
  }

  public handleMouseEnter(_pos: Position): void | Promise<void> {}
}
