import { forEachBatch } from "../arrayutil";
import { Configure } from "../configure";
import { CanvasElement, ZIndex } from "../render/canvaselement";
import { Rect } from "../render/renderutil";
import { CardInPlay } from "./cardinplay";

const RADIUS_SCALING = 3.6; // should be > 1;

export class Hand extends CanvasElement {
  public override children: CardInPlay[] = [];

  public update(rect: Rect) {
    this.rd = { ...this.rd, ...rect };

    const cardsPerRow = Math.floor(
      this.rd.w / (Configure.CARD_WIDTH * Configure.NONOVERLAP_RATIO)
    );
    const rows = Math.ceil(this.children.length / cardsPerRow);
    const radius = this.rd.w * RADIUS_SCALING;

    forEachBatch(this.children, cardsPerRow, (batch, batchIndex) => {
      const lastHoveredIndex = CardInPlay.lastHoveredCard
        ? batch.indexOf(CardInPlay.lastHoveredCard)
        : -1;
      batch.forEach((card: CardInPlay, index: number) => {
        let dx = index - 0.5 * (batch.length - 1);
        dx *= Configure.CARD_WIDTH * Configure.NONOVERLAP_RATIO;
        let dy = batchIndex - rows;
        dy *= Configure.CARD_HEIGHT * Configure.NONOVERLAP_RATIO;
        const angle = Math.asin(dx / radius);
        if (lastHoveredIndex !== -1 && lastHoveredIndex !== index) {
          dx +=
            index > lastHoveredIndex
              ? Configure.CARD_WIDTH / 2
              : -Configure.CARD_WIDTH / 2;
        }
        if (lastHoveredIndex === index) {
          card.update(
            {
              x: this.rd.w / 2 + dx,
              y: dy / Configure.NONOVERLAP_RATIO,
              rot: 0,
              scale: 1.5,
            },
            0
          );
        } else {
          card.update({ x: this.rd.w / 2 + dx, y: dy, rot: angle, scale: 1 });
        }
        card.zIndex = ZIndex.HandCard;
      });
    });
  }
}
