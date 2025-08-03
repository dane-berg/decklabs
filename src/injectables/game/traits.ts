import { allManaColorValues, ManaColorValue } from "../cardsservice/manacolor";

export enum BaseTrait {
  Basic = "Basic",
  Creature = "Creature",
  Land = "Land",
}
export type Trait = BaseTrait | ManaColorValue;
export function isTrait(s: string): s is Trait {
  return Object.values(BaseTrait).includes(s) || allManaColorValues.includes(s);
}
