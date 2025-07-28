import { CardId } from "../cardsservice/card";

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
