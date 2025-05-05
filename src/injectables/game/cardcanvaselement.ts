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
    this.rd.scale = Math.min(
      rect.w / Configure.CARD_WIDTH,
      rect.h / Configure.CARD_HEIGHT
    );
    this.rd.x = rect.x;
    this.rd.y = rect.y;
  }

  public override draw(ctx: CanvasRenderingContext2D) {
    const img = this.card.getImg();
    const templateImg = this.card.getTemplateImg();
    if (img && templateImg) {
      // TODO: crop the art to preserve aspect ratio
      ctx.drawImage(img, 9, 20, 108, 76);
      ctx.drawImage(
        templateImg,
        0,
        0,
        Configure.CARD_WIDTH,
        Configure.CARD_HEIGHT
      );
      ctx.font = Configure.card_font_str;
      ctx.fillStyle = "black";
      ctx.fillText(this.card.name, 10, 16);
    }
  }
}
