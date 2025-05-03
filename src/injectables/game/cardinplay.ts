import { CanvasElement } from "../render/canvaselement";
import { Configure } from "../configure";
import { NoisytransformData } from "../render/noisyrenderdata";
import {
  Position,
  RenderData,
  subtract,
  TransformData,
} from "../render/renderutil";
import { Card } from "../cardsservice/card";

export class CardInPlay extends CanvasElement {
  public static lastHoveredCard?: CardInPlay;
  public transformData: NoisytransformData = new NoisytransformData();

  constructor(public card: Card) {
    super();
  }

  public override draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(
      this.card.img,
      0,
      0,
      Configure.CARD_WIDTH,
      Configure.CARD_HEIGHT
    );
  }

  public update(
    renderData: Position & Partial<TransformData>,
    smoothing: number = Configure.ANIMATION_SMOOTHING
  ) {
    this.transformData.update(
      subtract(
        { rot: 0, scale: 1, ...renderData },
        {
          x: Configure.CARD_WIDTH / 2,
          y: Configure.CARD_HEIGHT / 2,
          rot: 0,
          scale: 0,
        }
      ),
      smoothing
    );
    const td =
      CardInPlay.lastHoveredCard === this
        ? {
            x:
              (this.transformData.transformData.x ?? 0) -
              Configure.CARD_WIDTH / 2,
            y:
              (this.transformData.transformData.y ?? 0) -
              Configure.CARD_HEIGHT / 2,
            rot: 0,
            scale: 1.5,
          }
        : this.transformData.getCurrentData();
    this.rd = {
      ...td,
      w: Configure.CARD_WIDTH,
      h: Configure.CARD_HEIGHT,
    };
  }

  public clearRenderData() {
    this.transformData.clear();
  }

  public override handleMouseEnter() {
    console.log("mouse enter card");
    CardInPlay.lastHoveredCard = this;
  }
}
