import { CardInPlay } from "./cardinplay";
import { Configure } from "../configure";
import { CanvasElement, ZIndex } from "../render/canvaselement";
import { Rect, RenderData } from "../render/renderutil";

const HORIZONTAL_SPACING = 1.1;

export class PlayArea extends CanvasElement {
  public override children: CardInPlay[] = [];

  constructor() {
    super({ x: 0, y: 0, w: 0, h: 0 }, ZIndex.Background);
  }

  public update(rect: Rect) {
    this.rect = rect;

    const x_scale =
      Configure.CARD_WIDTH +
      (this.rect.w - this.children.length * Configure.CARD_WIDTH) /
        (1 + this.children.length);
    this.children.forEach((card, index) =>
      card.update({
        x: x_scale * (index - (this.children.length - 1) / 2),
        y: 0,
      })
    );
  }

  public set zIndex(_zIndex: number) {
    throw new Error("set PlayArea.zIndex");
  }

  public override getRenderData(): RenderData {
    const necessaryWidth =
      (1 + this.children.length) * Configure.CARD_WIDTH * HORIZONTAL_SPACING;
    const canvasScale = Math.max(1, necessaryWidth / this.rect.w);
    if (canvasScale > 1) {
      console.log(`canvasScale: ${canvasScale}`);
    }
    return {
      x: this.rect.x + this.rect.w / 2,
      y: this.rect.y + this.rect.h / 2,
      rot: 0,
      scale: canvasScale,
    };
  }

  // for debugging
  public override draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = "red";
    ctx.fillRect(0, 0, this.rect.w, this.rect.h);
  }

  public override handleMouseEnter() {
    console.log("mouse enter playarea");
  }
}
