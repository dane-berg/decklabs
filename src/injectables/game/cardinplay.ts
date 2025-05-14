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
import { Game } from "./game";
import { CardCanvasElement } from "./cardcanvaselement";

const NOISE_SCALE = 0.04;

export class CardInPlay extends CanvasElement {
  public static lastHoveredCard?: CardInPlay;
  public transformData: NoisyTransformData = new NoisyTransformData();

  constructor(
    private game: Game,
    public card: Card,
    public noiseScale: number = NOISE_SCALE
  ) {
    super();
    this.addChild(new CardCanvasElement(this.card));
  }

  public get rd(): RenderData {
    return add(
      this._rd,
      scale(
        { ...this.transformData.getCurrentData(), w: 0, h: 0 },
        this.noiseScale
      )
    );
  }
  public set rd(rd: RenderData) {
    this._rd = subtract(rd, {
      x: Configure.CARD_WIDTH / 2,
      y: Configure.CARD_HEIGHT / 2,
      w: 0,
      h: 0,
      rot: 0,
      scale: 0,
    });
  }

  public update(
    renderData: Position & Partial<TransformData>,
    noiseScale: number = NOISE_SCALE,
    smoothing: number = Configure.ANIMATION_SMOOTHING
  ) {
    this.transformData.update();
    const newData = add(
      scale(this._rd, smoothing),
      scale(
        subtract(
          { rot: 0, scale: 1, ...renderData },
          {
            x: Configure.CARD_WIDTH / 2,
            y: Configure.CARD_HEIGHT / 2,
            rot: 0,
            scale: 0,
          }
        ),
        1 - smoothing
      )
    );
    this._rd = {
      ...newData,
      w: Configure.CARD_WIDTH,
      h: Configure.CARD_HEIGHT,
    };
    this.noiseScale =
      this.noiseScale * smoothing + noiseScale * (1 - smoothing);
  }

  public override onMouseEnter() {
    CardInPlay.lastHoveredCard = this;
  }

  public override onClick() {
    this.game.onCardCast(this);
  }
}
