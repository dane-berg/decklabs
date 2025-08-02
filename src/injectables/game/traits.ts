export enum Trait {
  Basic = "Basic",
  Land = "Land",
}
export function isTrait(s: string): s is Trait {
  return Object.values(Trait).includes(s);
}
