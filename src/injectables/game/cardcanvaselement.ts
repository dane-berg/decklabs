import { Card } from "../cardsservice/card";
import { Configure } from "../configure";
import { RootElement } from "../render/canvaselement";
import { Rect } from "../render/renderutil";

export class CardCanvasElement extends RootElement {
  constructor(public card: Card) {
    super({
      x: 0,
      y: 0,
      w: Configure.CARD_WIDTH,
      h: Configure.CARD_HEIGHT,
      rot: 0,
      scale: 1,
    });
  }

  public override update(rect: Rect) {
    this.rd = { ...this.rd, ...rect };
  }

  public override draw(ctx: CanvasRenderingContext2D) {
    const img = this.card.getImg();
    if (img) {
      ctx.drawImage(img, 0, 0, Configure.CARD_WIDTH, Configure.CARD_HEIGHT);
    }
  }
}
