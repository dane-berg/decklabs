import { forEachBatch } from "../arrayutil";
import { Card } from "../cardsservice/card";
import { Configure } from "../configure";
import { CanvasElement, ZIndex } from "../render/canvaselement";
import { Rect } from "../render/renderutil";
import { CardElement } from "./cardelement";

const MARGIN_RATIO = 1.1;

export class LibraryElement extends CanvasElement {
  public override children: CardElement[] = [];

  public constructor(cards: Card[]) {
    super();
    cards.forEach((card) => this.addChild(new CardElement(card)));
  }

  public update(rect: Rect) {
    this.rd = { ...this.rd, ...rect };

    const cols =
      Math.ceil(this.rd.w / (Configure.CARD_WIDTH * MARGIN_RATIO)) - 1;

    forEachBatch(this.children, cols, (batch, batchIndex) => {
      batch.forEach((card: CardElement, index: number) => {
        let dx = index - 0.5 * (cols - 1);
        dx *= this.rd.w / cols;

        const cardRd = {
          x: (this.rd.w - Configure.CARD_WIDTH) / 2 + dx,
          y: batchIndex * Configure.CARD_HEIGHT * MARGIN_RATIO,
          w: Configure.CARD_WIDTH,
          h: Configure.CARD_HEIGHT,
        };
        if (card === CardElement.lastHoveredCard) {
          const w = Math.min(
            this.rd.w,
            Configure.CARD_WIDTH * Configure.HOVERED_SCALE
          );
          const h = Math.min(
            this.rd.h,
            Configure.CARD_HEIGHT * Configure.HOVERED_SCALE
          );
          card.update({
            x: Math.max(
              0,
              Math.min(
                cardRd.x + (cardRd.w - w) / 2,
                this.rd.w - Configure.HOVERED_SCALE * Configure.CARD_WIDTH
              )
            ),
            y: Math.max(
              0,
              Math.min(
                cardRd.y + (cardRd.h - h) / 2,
                this.rd.h - Configure.HOVERED_SCALE * Configure.CARD_HEIGHT
              )
            ),
            w,
            h,
          });
          card.zIndex = ZIndex.Selection;
        } else {
          card.update(cardRd);
          card.zIndex = ZIndex.HandCard;
        }
      });
    });
  }
}
