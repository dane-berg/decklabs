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
  getCardsFp,
  getManaFp,
} from "./gameaction";
import { Card, CardId } from "../cardsservice/card";
import { LandArea } from "./landarea";
import { allManaColorValues } from "../cardsservice/manacolor";
import { BaseTrait } from "./traits";
import { ManaDisplay } from "./manadisplay";
import { SpellTrigger, triggerEffect } from "./magicinterpreter";

export class Game {
  private playerDeck: CardInPlay[] = [];
  public playerHand: Hand = new Hand();
  public playerPlayArea: PlayArea = new PlayArea();
  public playerLandArea: LandArea = new LandArea();
  public playerMana: ManaDisplay = new ManaDisplay();
  public playerHasPlayedLand: boolean = false;
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

  private findCard(cardId: CardId): Card {
    const card = this.cards.find((c) => c.id === cardId);
    if (!card) {
      throw new Error("Card Not Found in Game");
    }
    return card;
  }

  private isLand(cardId: CardId): boolean {
    const card = this.findCard(cardId);
    return card.traitsList.includes(BaseTrait.Land);
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

    // randomly generate two decks, guaranteeing that each has at least one land
    const guaranteedLand = this.cards.find((c) =>
      c.traitsList.includes(BaseTrait.Land)
    )?.id;
    if (!guaranteedLand) {
      throw new Error("No land cards in universe!");
    }
    initAction.playerOneDeck.push(guaranteedLand);
    initAction.playerTwoDeck.push(guaranteedLand);
    for (let i = 1; i < Configure.DECK_SIZE; i++) {
      initAction.playerOneDeck.push(this.cards[(2 * i) % this.cards.length].id);
      initAction.playerTwoDeck.push(
        this.cards[(2 * i + 1) % this.cards.length].id
      );
    }
    shuffleInPlace(initAction.playerOneDeck);
    shuffleInPlace(initAction.playerTwoDeck);

    if (Configure.guarantee_land_drop) {
      // player one
      let landIndex: number = initAction.playerOneDeck.findIndex((cardId) =>
        this.isLand(cardId)
      );
      let land: CardId = initAction.playerOneDeck[landIndex];
      initAction.playerOneDeck[landIndex] = initAction.playerOneDeck[0];
      initAction.playerOneDeck[0] = land;
      // player two
      landIndex = initAction.playerTwoDeck.findIndex((cardId) =>
        this.isLand(cardId)
      );
      land = initAction.playerTwoDeck[landIndex];
      initAction.playerTwoDeck[landIndex] = initAction.playerTwoDeck[0];
      initAction.playerTwoDeck[0] = land;
    }
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

  public async verifyAction(action: GameAction): Promise<boolean> {
    switch (action.type) {
      case GameActionType.Init: {
        if (this.actionStack.length !== 0) {
          console.log("can only initialize empty games");
          return false;
        }
        return true;
      }
      case GameActionType.Cast: {
        // spell must be in hand
        const spell: CardInPlay | undefined = this.playerHand.children.find(
          (c) => c.instanceId === action.spell
        );
        if (!spell) {
          console.log("spell must be in hand!");
          return false;
        }
        // must be able to pay mana cost
        if (
          !allManaColorValues.every(
            (color) =>
              (this.playerMana.mana.get(color) || 0) >=
              (spell.card.mana.get(color) || 0)
          )
        ) {
          console.log("must be able to pay mana cost!");
          return false;
        }
        // can only play one land per turn
        if (
          spell.card.traitsList.includes(BaseTrait.Land) &&
          this.playerHasPlayedLand
        ) {
          console.log("can only play one land per turn!");
          return false;
        }
        return true;
      }
      case GameActionType.TapLand: {
        // spell must be in hand
        const spell: CardInPlay | undefined = this.playerLandArea.children.find(
          (c) => c.instanceId === action.spell
        );
        if (!spell) {
          console.log("land must be in land area!");
          return false;
        }
        return true;
      }
      default: {
        throw new Error(`Unrecognized GameAction ${action.type}`);
      }
    }
  }

  // TODO: make unapplyAction (does each item on the stack need to have a list of reversal actions?)
  public async applyAction(action: GameAction): Promise<boolean> {
    console.log(action);
    try {
      switch (action.type) {
        case GameActionType.Init: {
          const newPlayerDeck = await Promise.all(
            action.playerOneDeck.map(async (cardId: CardId) => {
              return new CardInPlay(this, this.findCard(cardId));
            })
          );
          const newPlayerHand = await Promise.all(
            action.playerOneHand.map(async (cardId: CardId) => {
              return new CardInPlay(this, this.findCard(cardId));
            })
          );
          this.playerDeck = newPlayerDeck;
          this.playerHand.setChildren(newPlayerHand);
          break;
        }
        case GameActionType.Cast: {
          const spell: CardInPlay | undefined = this.playerHand.children.find(
            (c) => c.instanceId === action.spell
          );
          if (!spell) {
            throw new Error("Card Not Found in Player Hand");
          }
          // pay mana cost
          allManaColorValues.forEach((color) => {
            this.playerMana.mana.set(
              color,
              (this.playerMana.mana.get(color) || 0) -
                (spell.card.mana.get(color) || 0)
            );
          });
          // parse spell effect
          triggerEffect(this, spell, SpellTrigger.onCast);
          if (spell.card.traitsList.includes(BaseTrait.Land)) {
            this.playerLandArea.addChild(spell);
            this.playerHasPlayedLand = true;
          } else if (spell.card.traitsList.includes(BaseTrait.Creature)) {
            this.playerPlayArea.addChild(spell);
          } else {
            this.playerHand.removeChild(spell); // TODO: move to discard
          }
          break;
        }
        case GameActionType.TapLand: {
          // spell must be in hand
          const spell: CardInPlay | undefined =
            this.playerLandArea.children.find(
              (c) => c.instanceId === action.spell
            );
          if (!spell) {
            throw new Error("Card Not Found in Player Land Area");
          }
          triggerEffect(this, spell, SpellTrigger.onTap);
          break;
        }
        default: {
          throw new Error(`Unrecognized GameAction ${action.type}`);
        }
      }
    } catch (e) {
      console.log(e);
      return false;
    }
    this.actionStack.push({ ...action, fp: this.getFingerprint() });
    if (
      this.actionStack.length > 1 &&
      this.actionStack[this.actionStack.length - 1]?.fp ===
        this.actionStack[this.actionStack.length - 2]?.fp
    ) {
      throw new Error("Every action must modify the game fingerprint");
    }
    console.log(this.actionStack.map((a) => `${a.type} ${a.fp}`));
    return true;
  }

  public async applyActionIfVerified(action: GameAction): Promise<boolean> {
    if (await this.verifyAction(action)) {
      return this.applyAction(action);
    }
    return false;
  }

  private getFingerprint(): FingerprintValue {
    const deckFp = getCardsFp(this.playerDeck, 1);
    const handFp = getCardsFp(this.playerHand.children, 2);
    const landAreaFp = getCardsFp(this.playerLandArea.children, 3);
    const playAreaFp = getCardsFp(this.playerPlayArea.children, 4);
    const manaFp = getManaFp(this.playerMana.mana, 5);

    return deckFp ^ handFp ^ landAreaFp ^ playAreaFp ^ manaFp;
  }
}
