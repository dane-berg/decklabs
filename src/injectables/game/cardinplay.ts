import { CanvasElement, ZIndex } from "../render/canvaselement";
import { Configure } from "../configure";
import { NoisyTransformData } from "../render/noisytransformdata";
import {
  add,
  Position,
  RenderData,
  scale,
  TransformData,
} from "../render/renderutil";
import { Card } from "../cardsservice/card";
import { Game } from "./game";
import { CardElement } from "./cardelement";
import { CardInstanceId } from "./gameaction";

const NOISE_SCALE = 0.04;

export class CardInPlay extends CanvasElement {
  public static lastInstanceId: CardInstanceId = 0;

  public instanceId: CardInstanceId = ++CardInPlay.lastInstanceId;
  public transformData: NoisyTransformData = new NoisyTransformData();

  constructor(
    private game: Game,
    public card: Card,
    public noiseScale: number = NOISE_SCALE
  ) {
    super();
    const child = new CardElement(this.card);
    this.addChild(child, ZIndex.NonInteractive, false);
  }

  public get rd(): RenderData {
    const offsetRD = add(this._rd, {
      x: (-Configure.CARD_WIDTH * this._rd.scale) / 2,
      y: (-Configure.CARD_HEIGHT * this._rd.scale) / 2,
      w: 0,
      h: 0,
      rot: 0,
      scale: 0,
    });
    const noiseRD = scale(
      { ...this.transformData.getCurrentData(), w: 0, h: 0 },
      this.noiseScale
    );
    return add(offsetRD, noiseRD);
  }
  public set rd(rd: RenderData | TransformData) {
    this._rd = {
      ...rd,
      w: Configure.CARD_WIDTH,
      h: Configure.CARD_HEIGHT,
    };
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
    this.rd = newData;
    this.noiseScale =
      this.noiseScale * smoothing + noiseScale * (1 - smoothing);
  }

  public override onClick() {
    this.game.onCardClick(this);
  }

  public override onMouseEnter(pos: Position) {
    this.children[0]?.onMouseEnter(pos);
  }

  public override logName(): string {
    return `CardInPlay "${this.card.name}"`;
  }
}
