import { allManaColorValues, ManaColorValue } from "../cardsservice/manacolor";
import { Configure } from "../configure";
import { CanvasElement, ZIndex } from "../render/canvaselement";
import { RenderData, withEvenSpacing } from "../render/renderutil";
import { CardInPlay } from "./cardinplay";
import { GameActionType } from "./gameaction";

export class LandArea extends CanvasElement {
  public override children: CardInPlay[] = [];

  public update(rd: Partial<RenderData>) {
    this._rd = { ...this._rd, ...rd };

    const groups: Partial<Record<ManaColorValue, CardInPlay[]>> = {};
    this.children.forEach((card) => {
      const color = card.card.primaryColor();
      if (!groups[color]) {
        groups[color] = [];
      }
      groups[color].push(card);
    });

    withEvenSpacing(
      this,
      Object.values(groups),
      0,
      Configure.CARD_WIDTH * Configure.SPACING_RATIO,
      (group: CardInPlay[], xPos: number) => {
        group.forEach((card: CardInPlay, index: number) => {
          card.update({
            x: xPos,
            y: Configure.CONDENSED_CARD_HEIGHT / 2 + index * 20,
            rot: 0,
            scale: 1,
          });
          card.zIndex = card.cardElement.isTapped
            ? ZIndex.NonInteractive
            : ZIndex.CastCard;
          card.cardElement.fullArt = false;
        });
      }
    );
  }

  public onCardClick(card: CardInPlay) {
    card.game.applyActionIfVerified({
      type: GameActionType.TapLand,
      spell: card.instanceId,
    });
  }
}
