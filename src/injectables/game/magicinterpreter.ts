import { parseManaString } from "../cardsservice/card";
import { allManaColorValues } from "../cardsservice/manacolor";
import { CardInPlay } from "./cardinplay";
import { Game } from "./game";

export enum SpellTrigger {
  onCast = "onCast",
  onTap = "onTap",
}

const validExpressions: [RegExp, (game: Game, spellLine: string) => void][] = [
  [
    /gainMana(.*)/,
    (game: Game, spellLine: string) => {
      const manaString = spellLine.slice(9, spellLine.length - 1);
      console.log(`gainMana called with ${manaString}`);
      const mana = new Map<string, number>(
        Object.entries(parseManaString(manaString))
      );
      allManaColorValues.forEach((color) => {
        game.playerMana.mana.set(
          color,
          (game.playerMana.mana.get(color) || 0) + (mana.get(color) || 0)
        );
      });
    },
  ],
];

export function getTriggerEffect(
  spell: CardInPlay,
  trigger: SpellTrigger
): string[] {
  const spellEffect = spell.card.effect
    .split("@")
    .find((spellEffect) => spellEffect.startsWith(trigger));
  if (spellEffect) {
    const spellLines = spellEffect
      ?.split(";")
      .splice(1)
      .map((str) => str.trim())
      .filter((str) => !!str);
    return spellLines;
  }
  return [];
}

export function triggerEffect(
  game: Game,
  spell: CardInPlay,
  trigger: SpellTrigger
) {
  for (const spellLine of getTriggerEffect(spell, trigger)) {
    const validExpression = validExpressions.find(([reg, _]) =>
      reg.test(spellLine)
    );
    if (validExpression) {
      validExpression[1](game, spellLine);
    } else {
      throw new Error(`Invalid spell line: ${spellLine}`);
    }
  }
}
