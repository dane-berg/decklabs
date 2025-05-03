import { CanvasElement } from "../render/canvaselement";
import { Configure } from "../configure";
import { NoisyTransformData } from "../render/noisytransformdata";
import {
  add,
  Position,
  RenderData,
  scale,
  subtract,
  TransformData,
} from "../render/renderutil";
import { Card } from "../cardsservice/card";

const NOISE_SCALE = 0.04;

export class CardInPlay extends CanvasElement {
  public static lastHoveredCard?: CardInPlay;
  public transformData: NoisyTransformData = new NoisyTransformData();

  constructor(public card: Card, public noiseScale: number = NOISE_SCALE) {
    super();
  }

  public get rd(): RenderData {
    return add(
      subtract(this._rd, {
        x: Configure.CARD_WIDTH / 2,
        y: Configure.CARD_HEIGHT / 2,
        w: 0,
        h: 0,
        rot: 0,
        scale: 0,
      }),
      scale(
        { ...this.transformData.getCurrentData(), w: 0, h: 0 },
        this.noiseScale
      )
    );
  }
  public set rd(_rd: RenderData) {
    throw new Error("CardInPlay.rd setter");
  }

  public update(
    renderData: Position & Partial<TransformData>,
    noiseScale: number = NOISE_SCALE,
    smoothing: number = Configure.ANIMATION_SMOOTHING
  ) {
    this.transformData.update();
    const newData = add(
      scale(this._rd, smoothing),
      scale({ rot: 0, scale: 1, ...renderData }, 1 - smoothing)
    );
    this._rd = {
      ...newData,
      w: Configure.CARD_WIDTH,
      h: Configure.CARD_HEIGHT,
    };
    this.noiseScale =
      this.noiseScale * smoothing + noiseScale * (1 - smoothing);
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

  public override handleMouseEnter() {
    console.log("mouse enter card");
    CardInPlay.lastHoveredCard = this;
  }
}
