import { Card } from "../cardsservice/card";
import {
  ManaColor,
  ManaColors,
  ManaColorValue,
} from "../cardsservice/manacolor";
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
    const manaImgs = (Object.keys(ManaColors) as ManaColorValue[]).flatMap(
      (colorValue: ManaColorValue) => {
        const manaColor = ManaColors[colorValue];
        const numMana = this.card.mana[colorValue];
        return numMana ? Array(numMana).fill(manaColor.getImg()) : [];
      }
    );
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
      manaImgs.forEach((img, index) => {
        const diameter = 8;
        const imgSize = 7;
        const x = 122 + (1 + (2 * diameter) / 2) * (index - manaImgs.length);
        const y = 13;
        ctx.fillStyle = "darkgrey";
        ctx.beginPath();
        ctx.arc(x, y, diameter / 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.drawImage(img, x - imgSize / 2, y - imgSize / 2, imgSize, imgSize);
      });
      ctx.font = Configure.card_font_str;
      ctx.fillStyle = "black";
      ctx.fillText(this.card.name, 10, 16);
    }
  }
}
