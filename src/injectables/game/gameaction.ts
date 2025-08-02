import { CardId, Mana } from "../cardsservice/card";
import { allManaColorValues, ManaColorValue } from "../cardsservice/manacolor";
import { CardInPlay } from "./cardinplay";

export enum GameActionType {
  Init = "InitAction",
  Cast = "CastAction",
}
export type BaseGameAction = { type: GameActionType };
export type CardInstanceId = number;

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

export type GameAction = InitAction | CastAction;
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
  return cards.reduce(
    (h: FingerprintValue, card: CardInPlay) =>
      k * h + (card.instanceId ^ card.card.id),
    0
  );
}

export function getManaFp(mana: Mana, a: number = 0): FingerprintValue {
  const k = primes[a % primes.length];
  return allManaColorValues.reduce(
    (h: FingerprintValue, color: ManaColorValue) => k * h + (mana[color] || 0),
    0
  );
}
