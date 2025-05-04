import { CardInPlay } from "./cardinplay";
import { Configure } from "../configure";
import { CanvasElement, ZIndex } from "../render/canvaselement";
import { Rect } from "../render/renderutil";

const SPACING = 1.1;

export class PlayArea extends CanvasElement {
  public override children: CardInPlay[] = [];

  constructor() {
    super({ x: 0, y: 0, w: 0, h: 0, rot: 0, scale: 1 }, ZIndex.NonInteractive);
  }

  public get zIndex(): number {
    return this._zIndex;
  }
  public set zIndex(zIndex: number) {
    if (zIndex !== this._zIndex) {
      throw new Error(`cannot set PlayArea.zIndex to ${zIndex}`);
    }
  }

  public update(rect: Rect) {
    this.rd = { ...this.rd, ...rect };

    if (this.rd.w) {
      const necessaryWidth =
        (1 + this.children.length) * Configure.CARD_WIDTH * SPACING;
      this.rd.scale = Math.max(1, necessaryWidth / this.rd.w);
      if (this.rd.scale > 1) {
        console.log(`canvasScale: ${this.rd.scale}`);
      }
    }

    const x_scale =
      Configure.CARD_WIDTH +
      (this.rd.w - this.children.length * Configure.CARD_WIDTH) /
        (1 + this.children.length);
    this.children.forEach((card, index) =>
      card.update({
        x: x_scale * (index - (this.children.length - 1) / 2) + this.rd.w / 2,
        y: (Configure.CARD_HEIGHT * SPACING) / 2,
      })
    );
  }
}
