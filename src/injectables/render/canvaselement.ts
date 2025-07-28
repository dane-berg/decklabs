import { Canvas } from "./canvas";
import {
  Rect,
  Position,
  Vector,
  subtract,
  RenderData,
  scale,
} from "./renderutil";

export enum ZIndex {
  NonInteractive = 0,
  Background = 1,
  CastCard = 2,
  HandCard = 3,
  Selection = 4,
}

export class CanvasElement {
  // TODO: add abstract update() method
  // do not modify these properties manually
  public children: CanvasElement[] = [];
  public parent?: CanvasElement;

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
    // TODO: account for rotation
    return scale(
      subtract(this.parent ? this.parent.transform(pos) : pos, this.rd),
      1 / (this.rd.scale || 1)
    );
  }

  public contains(pos: Position): boolean {
    const diff: Vector = this.transform(pos);
    // a width or height of zero should always return false
    return (
      0 <= diff.x && diff.x < this.rd.w && 0 <= diff.y && diff.y < this.rd.h
    );
  }

  public addChild(
    e: CanvasElement,
    zIndex: number | undefined = undefined,
    preservePosition: boolean = true
  ) {
    if (e.parent) {
      e.parent.removeChild(e);
    }
    this.children.push(e);
    e.parent = this;
    if (preservePosition) {
      // TODO: account for scale & rotation
      e.rd = { ...e.rd, x: e.rd.x - this.rd.x, y: e.rd.y - this.rd.y };
      e.zIndex = zIndex ?? e.zIndex;
    }
  }

  public removeChild(e: CanvasElement, preservePosition: boolean = true) {
    const index = this.children.indexOf(e);
    if (index > -1) {
      if (preservePosition) {
        // TODO: account for scale & rotation
        e.rd = { ...e.rd, x: e.rd.x + this.rd.x, y: e.rd.y + this.rd.y };
      }
      this.children.splice(index, 1);
      e.parent = undefined;
      e.zIndex = ZIndex.NonInteractive;
    } else {
      throw new Error("removeChild received an orphan");
    }
  }

  public setChildren(children: CanvasElement[]) {
    this.children.forEach((c) => this.removeChild(c));
    children.forEach((c) => this.addChild(c));
  }

  public onMouseEnter(_pos: Position): void | Promise<void> {}

  public onClick(_pos: Position): void | Promise<void> {}

  public logName(): string {
    return this.constructor.name;
  }
}

export class RootElement extends CanvasElement {
  public update(rect: Rect) {
    this.rd = { ...this.rd, ...rect };
  }
}
