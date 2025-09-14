import { CardId, ManaMap } from "../cardsservice/card";
import { allManaColorValues, ManaColorValue } from "../cardsservice/manacolor";
import { CardInPlay } from "./cardinplay";

export type InitAction = {
  type: GameActionType.Init;
  playerOne: number;
  playerOneDeck: CardId[];
  playerOneHand: CardId[];
  playerTwo: number;
  playerTwoDeck: CardId[];
  playerTwoHand: CardId[];
};
export type CastAction = BaseGameAction & {
  type: GameActionType.Cast;
  spell: CardInstanceId;
};
export type TapLandAction = BaseGameAction & {
  type: GameActionType.TapLand;
  spell: CardInstanceId;
};
export type TapCardAction = BaseGameAction & {
  type: GameActionType.TapCard;
  spell: CardInstanceId;
};
export type EndTurnAction = BaseGameAction & {
  type: GameActionType.EndTurn;
  playerIndex: 1 | 2;
};

export enum GameActionType {
  Init = "InitAction",
  Cast = "CastAction",
  TapLand = "TapLandAction",
  TapCard = "TapCardAction",
  EndTurn = "EndTurnAction",
}
export type GameAction =
  | InitAction
  | CastAction
  | TapLandAction
  | TapCardAction
  | EndTurnAction;

export type BaseGameAction = { type: GameActionType };
export type CardInstanceId = number;
export type FingerprintValue = number;
export type FingerprintedGameAction = GameAction & { fp: FingerprintValue };

export function shuffleInPlace<T>(array: T[]): void {
  array.sort(() => 0.5 - Math.random());
}

const primes = [
  2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
];

export function getCardsFp(
  cards: CardInPlay[],
  a: number = 0
): FingerprintValue {
  const k = primes[a % primes.length];
  return cards.reduce((h: FingerprintValue, card: CardInPlay) => {
    if (card.cardElement.isTapped) {
      return k * h - (card.instanceId ^ card.card.id);
    } else {
      return k * h + (card.instanceId ^ card.card.id);
    }
  }, 0);
}

export function getManaFp(mana: ManaMap, a: number = 0): FingerprintValue {
  const k = primes[a % primes.length];
  return allManaColorValues.reduce(
    (h: FingerprintValue, color: ManaColorValue) =>
      k * h + (mana.get(color) || 0),
    0
  );
}
