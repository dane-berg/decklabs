import { Configure } from "../configure";
import { CardInPlay } from "./cardinplay";
import { DropZone } from "./dropzone";
import { PlayArea } from "./playarea";
import { CardsService } from "../cardsservice/cardsservice";
import { Hand } from "./hand";

export class Game {
  private playerDeck: CardInPlay[] = [];
  public playerPlayArea: PlayArea = new PlayArea();
  public playerHand: Hand = new Hand();

  private initPromise: Promise<boolean>;
  public initialized: boolean = false;

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
    this.playerHand.children = this.playerDeck.splice(
      0,
      Configure.STARTING_HAND_SIZE
    );

    return await DropZone.cardBackImgPromise;
  }

  private shuffleInPlace(cards: CardInPlay[]) {
    cards.sort(() => 0.5 - Math.random());
  }
}
