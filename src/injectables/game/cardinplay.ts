import { CanvasElement } from "../render/canvaselement";
import { Configure } from "../configure";
import { NoisyRenderData } from "../render/noisyrenderdata";
import {
  getCardBoundingBox,
  isRenderData,
  OptRenderData,
  Rect,
  RenderData,
} from "../render/renderutil";
import { Card, drawCard } from "../cardsservice/card";

/**
 * The CardInPlay CanvasElement should never have child elements because
 * its rendering is randomly perturbed
 */
export class CardInPlay extends CanvasElement {
  public renderData: NoisyRenderData = new NoisyRenderData();

  constructor(public card: Card) {
    super();
  }

  public get rect(): Rect {
    if (!isRenderData(this.renderData.renderData)) {
      return { x: 0, y: 0, w: 0, h: 0 };
    } else {
      return getCardBoundingBox(this.renderData.renderData);
    }
  }
  public set rect(_rect: Rect) {
    throw new Error("set CardInPlay.rect");
  }

  public override draw(ctx: CanvasRenderingContext2D) {
    drawCard(ctx, this.card, 0, 0, 1);
  }

  public override getRenderData(): RenderData {
    return this.renderData.getCurrentData();
  }

  public override handleMouseEnter() {
    console.log("mouse enter card");
  }

  public update(
    renderData: OptRenderData,
    smoothing: number = Configure.ANIMATION_SMOOTHING
  ) {
    this.renderData.update({ rot: 0, scale: 1, ...renderData }, smoothing);
  }

  public clearRenderData() {
    this.renderData.clear();
  }
}
