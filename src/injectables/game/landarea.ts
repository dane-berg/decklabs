import { allManaColorValues, ManaColorValue } from "../cardsservice/manacolor";
import { Configure } from "../configure";
import { CanvasElement, ZIndex } from "../render/canvaselement";
import { RenderData, withEvenSpacing } from "../render/renderutil";
import { CardInPlay } from "./cardinplay";

export class LandArea extends CanvasElement {
  public override children: CardInPlay[] = [];

  public update(rd: Partial<RenderData>) {
    this._rd = { ...this._rd, ...rd };

    const groups: Partial<Record<ManaColorValue, CardInPlay[]>> = {};
    this.children.forEach((card) => {
      const traits = card.card.traitsList;
      const color =
        allManaColorValues.find((color) => traits.includes(color)) ||
        ManaColorValue.Colorless;
      if (!groups[color]) {
        groups[color] = [];
      }
      groups[color].push(card);
    });
    const groupsList = allManaColorValues
      .map((color) => groups[color])
      .filter((arr) => !!arr);

    withEvenSpacing(
      this,
      groupsList,
      0,
      Configure.CARD_WIDTH * Configure.SPACING_RATIO,
      (group: CardInPlay[], xPos: number) => {
        group.forEach((card: CardInPlay, index: number) => {
          card.update({ x: xPos, y: index * 20, rot: 0, scale: 1 });
          card.zIndex = ZIndex.CastCard;
          card.cardElement.fullArt = false;
        });
      }
    );
  }
}
