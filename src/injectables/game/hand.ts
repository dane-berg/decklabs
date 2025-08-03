import { Configure } from "../configure";
import { CanvasElement, ZIndex } from "../render/canvaselement";
import { Rect, withEvenSpacing } from "../render/renderutil";
import { CardElement } from "./cardelement";
import { CardInPlay } from "./cardinplay";

export class Hand extends CanvasElement {
  public override children: CardInPlay[] = [];

  public update(rect: Rect) {
    this.rd = { ...this.rd, ...rect };

    const lastHoveredIndex = CardElement.lastHoveredCard
      ? this.children
          .map((cardInPlay) => cardInPlay.children[0])
          .indexOf(CardElement.lastHoveredCard)
      : -1;
    withEvenSpacing(
      this,
      this.children,
      Configure.CARD_WIDTH * Configure.HOVERED_SCALE,
      Configure.CARD_WIDTH * Configure.NONOVERLAP_RATIO,
      (card: CardInPlay, xPos: number, index: number) => {
        if (lastHoveredIndex <= -1) {
          card.update({
            x: xPos,
            y: Configure.CARD_HEIGHT / 2,
            rot: 0,
            scale: 1,
          });
          card.zIndex = ZIndex.HandCard;
        } else {
          if (index === lastHoveredIndex) {
            card.update(
              {
                x: xPos,
                y: Configure.CARD_HEIGHT * (1 - Configure.HOVERED_SCALE / 2),
                rot: 0,
                scale: Configure.HOVERED_SCALE,
              },
              0
            );
            card.zIndex = ZIndex.Selection;
          } else {
            const offset =
              ((index < lastHoveredIndex ? -1 : 1) * Configure.CARD_WIDTH) / 2;
            card.update({
              x: xPos + offset,
              y: Configure.CARD_HEIGHT / 2,
              rot: 0,
              scale: 1,
            });
            card.zIndex = ZIndex.HandCard;
          }
        }
      }
    );
  }
}
