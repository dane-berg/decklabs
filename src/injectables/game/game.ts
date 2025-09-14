import { Configure } from "../configure";
import { CardInPlay } from "./cardinplay";
import { DropZone } from "./dropzone";
import { CardsService } from "../cardsservice/cardsservice";
import {
  GameAction,
  FingerprintedGameAction,
  FingerprintValue,
  InitAction,
  shuffleInPlace,
  GameActionType,
} from "./gameaction";
import { Card, CardId, ManaMap } from "../cardsservice/card";
import { allManaColorValues, ManaColorValue } from "../cardsservice/manacolor";
import { BaseTrait } from "./traits";
import {
  getTriggerEffect,
  SpellTrigger,
  triggerEffect,
} from "./magicinterpreter";
import { arrayEquals } from "../arrayutil";
import { Agent } from "./agent";
import { PlayerData } from "./playerdata";

export class Game {
  private initPromise: Promise<boolean>;
  public initialized: boolean = false;
  private actionStack: FingerprintedGameAction[] = [];
  private cards: Card[] = [];
  public playerOne = new PlayerData();
  public playerTwo = new PlayerData();
  public activePlayer: PlayerData = this.playerOne;
  private opponent = new Agent(this);

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

  private isSimpleLand(card: CardInPlay, color?: ManaColorValue): boolean {
    return arrayEquals(
      [`gainMana(${color ?? card.card.primaryColor()})`],
      getTriggerEffect(card, SpellTrigger.onTap)
    );
  }

  /**
   * @returns A map of the mana that can be obtained by tapping simple lands
   */
  private getSimpleUntappedLandMana(player: PlayerData): ManaMap {
    const manaMap = new Map<string, number>();
    player.landArea.children
      .filter(
        (card: CardInPlay) =>
          !card.cardElement.isTapped && this.isSimpleLand(card)
      )
      .forEach((card: CardInPlay) =>
        manaMap.set(
          card.card.primaryColor(),
          (manaMap.get(card.card.primaryColor()) || 0) + 1
        )
      );
    return manaMap;
  }

  private tapUntappedSimpleLand(
    player: PlayerData,
    color: ManaColorValue,
    n: number
  ) {
    for (const card of player.landArea.children) {
      if (n <= 0) {
        break;
      }
      if (!card.cardElement.isTapped && this.isSimpleLand(card, color)) {
        this.applyAction({
          type: GameActionType.TapLand,
          spell: card.instanceId,
        });
        n--;
      }
    }
  }

  private tapUntappedSimpleLandOfAnyColor(player: PlayerData, n: number) {
    for (const card of player.landArea.children) {
      if (n <= 0) {
        break;
      }
      if (!card.cardElement.isTapped && this.isSimpleLand(card)) {
        this.applyAction({
          type: GameActionType.TapLand,
          spell: card.instanceId,
        });
        n--;
      }
    }
  }

  public async verifyAction(action: GameAction): Promise<boolean> {
    switch (action.type) {
      case GameActionType.Init: {
        if (this.actionStack.length !== 0) {
          Configure.DEBUG_MODE &&
            console.log("can only initialize empty games");
          return false;
        }
        return true;
      }
      case GameActionType.Cast: {
        // spell must be in hand
        const spell: CardInPlay | undefined =
          this.activePlayer.hand.children.find(
            (c) => c.instanceId === action.spell
          );
        if (!spell) {
          Configure.DEBUG_MODE && console.log("spell must be in hand!");
          return false;
        }
        // must be able to pay mana cost
        const simpleUntappedLandMana = this.getSimpleUntappedLandMana(
          this.activePlayer
        );
        // colorless mana can only be used to pay colorless cost
        // any mana can pay a colorless cost
        let remainingColorlessToPay = 0;
        let canPay = true;
        for (const color of allManaColorValues) {
          if (color === ManaColorValue.Colorless) {
            remainingColorlessToPay +=
              (spell.card.mana.get(color) || 0) -
              ((this.activePlayer.mana.mana.get(color) || 0) +
                (simpleUntappedLandMana.get(color) || 0));
          } else {
            const remainingOfColor =
              (this.activePlayer.mana.mana.get(color) || 0) +
              (simpleUntappedLandMana.get(color) || 0) -
              (spell.card.mana.get(color) || 0);
            if (remainingOfColor < 0) {
              canPay = false;
            }
            remainingColorlessToPay -= remainingOfColor;
          }
        }
        canPay = canPay && remainingColorlessToPay <= 0;
        if (!canPay) {
          Configure.DEBUG_MODE && console.log("must be able to pay mana cost!");
          return false;
        }
        // can only play one land per turn
        if (
          spell.card.traitsList.includes(BaseTrait.Land) &&
          this.activePlayer.hasPlayedLand
        ) {
          Configure.DEBUG_MODE &&
            console.log("can only play one land per turn!");
          if (!Configure.DEBUG_MODE) {
            return false;
          }
        }
        return true;
      }
      case GameActionType.TapLand: {
        const spell: CardInPlay | undefined =
          this.activePlayer.landArea.children.find(
            (c) => c.instanceId === action.spell
          );
        if (!spell) {
          Configure.DEBUG_MODE && console.log("land must be in land area!");
          return false;
        }
        if (spell.cardElement.isTapped) {
          Configure.DEBUG_MODE &&
            console.log("cannot tap an already tapped land");
          return false;
        }
        return true;
      }
      case GameActionType.TapCard: {
        const spell: CardInPlay | undefined =
          this.activePlayer.playArea.children.find(
            (c) => c.instanceId === action.spell
          );
        if (!spell) {
          Configure.DEBUG_MODE && console.log("card must be in play area!");
          return false;
        }
        if (spell.cardElement.isTapped) {
          Configure.DEBUG_MODE &&
            console.log("cannot tap an already tapped card");
          return false;
        }
        return true;
      }
      case GameActionType.EndTurn: {
        return (
          (action.playerIndex === 1 && this.activePlayer === this.playerOne) ||
          (action.playerIndex === 2 && this.activePlayer === this.playerTwo)
        );
      }
      default: {
        throw new Error(`Unrecognized GameAction ${action.type}`);
      }
    }
  }

  public async applyAction(action: GameAction): Promise<boolean> {
    const result = await this._applyAction(action);
    this.opponent.triggerNextAction(result); // do not await this promise
    return result;
  }

  // TODO: make unapplyAction (does each item on the stack need to have a list of reversal actions?)
  public async _applyAction(action: GameAction): Promise<boolean> {
    Configure.DEBUG_MODE && console.log(action);
    try {
      switch (action.type) {
        case GameActionType.Init: {
          // Player One
          this.playerOne.deck = await Promise.all(
            action.playerOneDeck.map(async (cardId: CardId) => {
              return new CardInPlay(this, this.findCard(cardId));
            })
          );
          this.playerOne.hand.setChildren(
            await Promise.all(
              action.playerOneHand.map(async (cardId: CardId) => {
                return new CardInPlay(this, this.findCard(cardId));
              })
            )
          );
          // Player Two
          this.playerTwo.deck = await Promise.all(
            action.playerTwoDeck.map(async (cardId: CardId) => {
              return new CardInPlay(this, this.findCard(cardId));
            })
          );
          this.playerTwo.hand.setChildren(
            await Promise.all(
              action.playerTwoHand.map(async (cardId: CardId) => {
                return new CardInPlay(this, this.findCard(cardId));
              })
            )
          );
          break;
        }
        case GameActionType.Cast: {
          const spell: CardInPlay | undefined =
            this.activePlayer.hand.children.find(
              (c) => c.instanceId === action.spell
            );
          if (!spell) {
            throw new Error("Card Not Found in Player Hand");
          }
          // pay mana cost
          for (const color of [...allManaColorValues].reverse()) {
            if (color !== ManaColorValue.Colorless) {
              this.tapUntappedSimpleLand(
                this.activePlayer,
                color,
                (spell.card.mana.get(color) || 0) -
                  (this.activePlayer.mana.mana.get(color) || 0)
              );
              this.activePlayer.mana.mana.set(
                color,
                (this.activePlayer.mana.mana.get(color) || 0) -
                  (spell.card.mana.get(color) || 0)
              );
            } else {
              // colorless mana can only be used to pay colorless cost
              // any mana can pay a colorless cost
              let remainingToPay = spell.card.mana.get(color) || 0;
              for (const color of allManaColorValues) {
                const amount = Math.min(
                  remainingToPay,
                  this.activePlayer.mana.mana.get(color) || 0
                );
                remainingToPay -= amount;
                this.activePlayer.mana.mana.set(
                  color,
                  (this.activePlayer.mana.mana.get(color) || 0) - amount
                );
              }
              this.tapUntappedSimpleLandOfAnyColor(
                this.activePlayer,
                remainingToPay
              );
              for (const color of allManaColorValues) {
                const amount = Math.min(
                  remainingToPay,
                  this.activePlayer.mana.mana.get(color) || 0
                );
                remainingToPay -= amount;
                this.activePlayer.mana.mana.set(
                  color,
                  (this.activePlayer.mana.mana.get(color) || 0) - amount
                );
              }
            }
          }
          // parse spell effect
          triggerEffect(this, spell, SpellTrigger.onCast);
          if (spell.card.traitsList.includes(BaseTrait.Land)) {
            this.activePlayer.landArea.addChild(spell);
            this.activePlayer.hasPlayedLand = true;
          } else if (spell.card.traitsList.includes(BaseTrait.Creature)) {
            this.activePlayer.playArea.addChild(spell);
          } else {
            this.activePlayer.hand.removeChild(spell); // TODO: move to discard
          }
          break;
        }
        case GameActionType.TapLand: {
          const spell: CardInPlay | undefined =
            this.activePlayer.landArea.children.find(
              (c) => c.instanceId === action.spell
            );
          if (!spell) {
            throw new Error("Card Not Found in Player Land Area");
          }
          spell.cardElement.isTapped = true;
          triggerEffect(this, spell, SpellTrigger.onTap);
          break;
        }
        case GameActionType.TapCard: {
          const spell: CardInPlay | undefined =
            this.activePlayer.playArea.children.find(
              (c) => c.instanceId === action.spell
            );
          if (!spell) {
            throw new Error("Card Not Found in Player Play Area");
          }
          spell.cardElement.isTapped = true;
          triggerEffect(this, spell, SpellTrigger.onTap);
          break;
        }
        case GameActionType.EndTurn: {
          if (action.playerIndex === 1) {
            this.activePlayer = this.playerTwo;
          } else if (action.playerIndex === 2) {
            this.activePlayer = this.playerOne;
          }
          this.activePlayer.hasPlayedLand = false;
          for (const landCard of this.activePlayer.landArea.children) {
            landCard.cardElement.isTapped = false;
          }
          for (const permanent of this.activePlayer.playArea.children) {
            permanent.cardElement.isTapped = false;
          }
          const card = this.activePlayer.deck.pop();
          if (card) {
            this.activePlayer.hand.addChild(card);
          }
          // TODO: if you are out of cards, lose the game
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
    Configure.DEBUG_MODE &&
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
    return (
      this.playerOne.getFingerprint() + 2 * this.playerTwo.getFingerprint()
    );
  }
}
