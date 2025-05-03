import { Configure } from "../configure";
import { forEachBatch } from "../arrayutil";
import { CardInPlay } from "./cardinplay";
import { DropZone } from "./dropzone";
import { PlayArea } from "./playarea";
import { CanvasEventHandler } from "../render/canvaseventhandler";
import { CardsService } from "../cardsservice/cardsservice";

const NONOVERLAP_RATIO = 0.7;
const RADIUS_SCALING = 1.8; // should be > 0.5;

export class Game {
  private playerDeck: CardInPlay[] = [];
  private playerHand: CardInPlay[] = [];
  private playerPlayArea: PlayArea = new PlayArea();

  private initPromise: Promise<boolean>;
  private initialized: boolean = false;

  constructor() {
    this.initPromise = this.init().then((success) => {
      this.initialized = success;
      return success;
    });
  }

  private async init() {
    const cards = await CardsService.getAll();
    for (let i = 0; i < Configure.DECK_SIZE; i++) {
      this.playerDeck.push(new CardInPlay(cards[i % cards.length]));
    }
    this.shuffleInPlace(this.playerDeck);
    this.playerHand = this.playerDeck.splice(0, Configure.STARTING_HAND_SIZE);

    return await DropZone.cardBackImgPromise;
  }

  private shuffleInPlace(cards: CardInPlay[]) {
    cards.sort(() => 0.5 - Math.random());
  }

  private updatePlayAreas(canvas: HTMLCanvasElement) {
    this.playerPlayArea.update({
      x: 0,
      y: canvas.height / 2,
      w: canvas.width,
      h: canvas.height / 2 - Configure.CARD_HEIGHT * NONOVERLAP_RATIO,
    });
  }

  public render(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    if (!this.initialized) {
      console.log("game has not finished initializing!");
      return;
    }

    // state update
    this.updatePlayAreas(canvas);
    CanvasEventHandler.bindToCanvas(canvas);

    // rendering
    const cardsPerRow = Math.floor(
      (0.5 * canvas.width) / (Configure.CARD_WIDTH * NONOVERLAP_RATIO)
    );
    const rows = Math.ceil(this.playerHand.length / cardsPerRow);
    const radius = canvas.width * RADIUS_SCALING;
    ctx.save();
    this.playerPlayArea.render(ctx);
    ctx.translate(0.5 * canvas.width, canvas.height);
    // TODO: make a hand CanvasElement
    forEachBatch(this.playerHand, cardsPerRow, (batch, batchIndex) => {
      batch.forEach((card: CardInPlay, index: number) => {
        let dx = index - 0.5 * (batch.length - 1);
        dx *= Configure.CARD_WIDTH * NONOVERLAP_RATIO;
        let dy = batchIndex - rows;
        dy *= Configure.CARD_HEIGHT * NONOVERLAP_RATIO;
        const angle = Math.asin(dx / radius);
        card.update({ x: dx, y: dy, rot: angle, scale: 1 });
        card.render(ctx);
      });
    });

    ctx.restore();
  }
}
