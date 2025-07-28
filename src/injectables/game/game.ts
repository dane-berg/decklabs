import { Configure } from "../configure";
import { CardInPlay } from "./cardinplay";
import { DropZone } from "./dropzone";
import { PlayArea } from "./playarea";
import { CardsService } from "../cardsservice/cardsservice";
import { Hand } from "./hand";
import {
  GameAction,
  FingerprintedGameAction,
  FingerprintValue,
  InitAction,
  shuffleInPlace,
  GameActionType,
} from "./gameaction";
import { Card, CardId } from "../cardsservice/card";

export class Game {
  private playerDeck: CardInPlay[] = [];
  public playerHand: Hand = new Hand();
  public playerPlayArea: PlayArea = new PlayArea();
  private initPromise: Promise<boolean>;
  public initialized: boolean = false;
  private actionStack: FingerprintedGameAction[] = [];
  private cards: Card[] = [];

  constructor() {
    this.initPromise = this.init().then((success) => {
      this.initialized = success;
      return success;
    });
  }

  private async init() {
    this.cards = await CardsService.getAll();
    const initAction: InitAction = {
      type: GameActionType.Init,
      playerOne: Math.random(),
      playerOneDeck: [],
      playerOneHand: [],
      playerTwo: Math.random(),
      playerTwoDeck: [],
      playerTwoHand: [],
    };

    for (let i = 0; i < Configure.DECK_SIZE; i++) {
      initAction.playerOneDeck.push(this.cards[(2 * i) % this.cards.length].id);
      initAction.playerTwoDeck.push(
        this.cards[(2 * i + 1) % this.cards.length].id
      );
    }
    shuffleInPlace(initAction.playerOneDeck);
    shuffleInPlace(initAction.playerTwoDeck);
    initAction.playerOneHand = initAction.playerOneDeck.splice(
      0,
      Configure.STARTING_HAND_SIZE
    );
    initAction.playerTwoHand = initAction.playerTwoDeck.splice(
      0,
      Configure.STARTING_HAND_SIZE
    );

    this.applyAction(initAction);
    return await DropZone.cardBackImgPromise;
  }

  // TODO: make unapplyAction (does each item on the stack need to have a list of reversal actions?)
  public async applyAction(action: GameAction): Promise<boolean> {
    try {
      switch (action.type) {
        case GameActionType.Init: {
          const newPlayerDeck = await Promise.all(
            action.playerOneDeck.map(async (cardId: CardId) => {
              const card = await CardsService.getCard(cardId);
              if (!card) {
                throw new Error("Card Not Found");
              }
              return new CardInPlay(this, card);
            })
          );
          const newPlayerHand = await Promise.all(
            action.playerOneHand.map(async (cardId: CardId) => {
              const card = await CardsService.getCard(cardId);
              if (!card) {
                throw new Error("Card Not Found");
              }
              return new CardInPlay(this, card);
            })
          );
          this.playerDeck = newPlayerDeck;
          this.playerHand.setChildren(newPlayerHand);
          break;
        }
        case GameActionType.Cast: {
          const spell = this.playerHand.children.find(
            (c) => c.instanceId === action.spell
          );
          if (!spell) {
            throw new Error("Card Not Found");
          }
          // TODO: parse spell effect
          this.playerPlayArea.addChild(spell);
          break;
        }
        default: {
          throw new Error("Unrecognized GameAction");
        }
      }
    } catch (e) {
      console.log(e);
      return false;
    }
    this.actionStack.push({ ...action, fp: this.getFingerprint() });
    console.log(this.actionStack.map((a) => `${a.type} ${a.fp}`));
    return true;
  }

  private getFingerprint(): FingerprintValue {
    const a = 1;

    const deckFp = this.playerDeck.reduce(
      (h: FingerprintValue, card: CardInPlay) =>
        card.instanceId * h + card.card.id,
      a
    );
    const handFp = this.playerHand.children.reduce(
      (h: FingerprintValue, card: CardInPlay) =>
        card.instanceId * h + card.card.id,
      a
    );
    const playAreaFp = this.playerPlayArea.children.reduce(
      (h: FingerprintValue, card: CardInPlay) =>
        card.instanceId * h + card.card.id,
      a
    );
    return deckFp ^ handFp ^ playAreaFp;
  }

  public onCardClick(card: CardInPlay) {
    this.applyAction({ type: GameActionType.Cast, spell: card.instanceId });
  }
}
