import { Configure } from "../configure";
import { CanvasElement, ZIndex } from "../render/canvaselement";
import { Rect } from "../render/renderutil";
import { CardElement } from "./cardelement";
import { CardInPlay } from "./cardinplay";

export class Hand extends CanvasElement {
  public override children: CardInPlay[] = [];

  public update(rect: Rect) {
    this.rd = { ...this.rd, ...rect };

    const handWidth = Math.min(
      this.rd.w - Configure.CARD_WIDTH * Configure.HOVERED_SCALE,
      (this.children.length - 2) * Configure.CARD_WIDTH
    );
    const leftX = (this.rd.w - handWidth) / 2;
    const lastHoveredIndex = CardElement.lastHoveredCard
      ? this.children
          .map((cardInPlay) => cardInPlay.children[0])
          .indexOf(CardElement.lastHoveredCard)
      : -1;

    this.children.forEach((card, index) => {
      const dx = (index * handWidth) / (this.children.length - 1);
      if (lastHoveredIndex <= -1) {
        card.update({
          x: leftX + dx,
          y: Configure.CARD_HEIGHT / 2,
          rot: 0,
          scale: 1,
        });
        card.zIndex = ZIndex.HandCard;
      } else {
        if (index === lastHoveredIndex) {
          card.update(
            {
              x: leftX + dx,
              y: Configure.CARD_HEIGHT / 2,
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
            x: leftX + dx + offset,
            y: Configure.CARD_HEIGHT / 2,
            rot: 0,
            scale: 1,
          });
          card.zIndex = ZIndex.HandCard;
        }
      }
    });
  }
}
