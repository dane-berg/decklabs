import { Card } from "./card";
import { CardsService } from "./cardsservice";
import { Configure } from "./configure";
import { forEachBatch } from "./arrayutil";
import {
  add,
  drawCard,
  isRenderData,
  Position,
  randNoise,
  RenderData,
  scale,
} from "./renderutil";

const NONOVERLAP_RATIO = 0.7;
const RADIUS_SCALING = 1.8; // should be > 0.5;
const ANIMATION_SMOOTHING = 0.999; // must be > 0 and < 1;
const NOISE_DURATION = 300; // frames

class NoisyRenderData {
  public renderData: Partial<RenderData> = {};
  public noiseTimeout: number = Math.random() * NOISE_DURATION;
  public noiseA: RenderData = { x: 0, y: 0, rot: 0, scale: 0 };
  public noiseB: RenderData = this.newNoise();

  public newNoise(): RenderData {
    return {
      x: randNoise(0.02),
      y: randNoise(0.02),
      rot: randNoise(0.02),
      scale: randNoise(0.01),
    };
  }

  public update(newData: RenderData, smoothing: number = ANIMATION_SMOOTHING) {
    // update noise
    this.noiseTimeout += 1;
    if (this.noiseTimeout >= NOISE_DURATION) {
      this.noiseTimeout = 0;
      this.noiseA = this.noiseB;
      this.noiseB = this.newNoise();
    }

    // update actual render data
    const currentData: RenderData = { ...newData, ...this.renderData };
    this.renderData = add(
      scale(currentData, smoothing),
      scale(newData, 1 - smoothing)
    );
  }

  public getCurrentData(): RenderData {
    if (!isRenderData(this.renderData)) {
      throw new Error("RenderData must be defined");
    }
    const t: number = this.noiseTimeout / NOISE_DURATION;
    return add(
      this.renderData,
      add(scale(this.noiseB, t), scale(this.noiseA, 1 - t))
    );
  }

  public clear() {
    this.renderData.x = undefined;
    this.renderData.y = undefined;
    this.renderData.rot = undefined;
    this.renderData.scale = undefined;
  }
}

class CardInPlay {
  public card: Card;
  public renderData: NoisyRenderData;

  constructor(card: Card) {
    this.card = card;
    this.renderData = new NoisyRenderData();
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const { x, y, rot, scale } = this.renderData.getCurrentData();
    ctx.save();
    ctx.rotate(rot);
    drawCard(ctx, this.card, x, y, scale);
    ctx.restore();
  }

  public drawAt(
    ctx: CanvasRenderingContext2D,
    renderData: Position,
    smoothing: number = ANIMATION_SMOOTHING
  ) {
    this.renderData.update({ rot: 0, scale: 1, ...renderData }, smoothing);
    this.draw(ctx);
  }

  public clearRenderData() {
    this.renderData.clear();
  }
}

export class Game {
  private playerDeck: CardInPlay[] = [];
  private playerHand: CardInPlay[] = [];
  private initPromise?: Promise<void>;
  private initialized: boolean = false;

  constructor() {
    this.init();
  }

  private async init() {
    const cards = await CardsService.getAll();
    for (let i = 0; i < Configure.DECK_SIZE; i++) {
      this.playerDeck.push(new CardInPlay(cards[i % cards.length]));
    }
    this.shuffleInPlace(this.playerDeck);
    this.playerHand = this.playerDeck.splice(0, Configure.STARTING_HAND_SIZE);
    this.initialized = true;
  }

  private shuffleInPlace(cards: CardInPlay[]) {
    cards.sort(() => 0.5 - Math.random());
  }

  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    if (!this.initialized) {
      console.log("game has not finished initializing!");
      return;
    }
    const cardsPerRow = Math.floor(
      (0.5 * canvas.width) / (Configure.CARD_WIDTH * NONOVERLAP_RATIO)
    );
    const rows = Math.ceil(this.playerHand.length / cardsPerRow);
    const radius = canvas.width * RADIUS_SCALING;
    ctx.save();
    ctx.translate(0.5 * canvas.width, canvas.height);
    // draw the center of rotation
    //ctx.fillStyle = "red";
    //ctx.fillRect(-5, -5, 10, 10);
    forEachBatch(this.playerHand, cardsPerRow, (batch, batchIndex) => {
      batch.forEach((card: CardInPlay, index: number) => {
        let dx = index - 0.5 * batch.length;
        dx *= Configure.CARD_WIDTH * NONOVERLAP_RATIO;
        let dy = batchIndex - rows - 0.5;
        dy *= Configure.CARD_HEIGHT * NONOVERLAP_RATIO;
        const angle = Math.asin(dx / radius);
        card.drawAt(ctx, { x: dx, y: dy }, angle);
      });
    });
    ctx.restore();
  }
}
