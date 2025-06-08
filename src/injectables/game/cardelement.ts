import { Card } from "../cardsservice/card";
import { ManaColors, ManaColorValue } from "../cardsservice/manacolor";
import { Configure } from "../configure";
import { RootElement } from "../render/canvaselement";
import { Rect, wrapText } from "../render/renderutil";

export class CardElement extends RootElement {
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
    if (this.card.img && this.card.template.img) {
      // Art
      // TODO: crop the art to preserve aspect ratio
      ctx.drawImage(this.card.img, 9, 20, 108, 76);

      // Template
      ctx.drawImage(
        this.card.template.img,
        0,
        0,
        Configure.CARD_WIDTH,
        Configure.CARD_HEIGHT
      );

      // Mana
      // TODO: Use numbers to decrease the size of the mana cost
      const manaImgs: (HTMLImageElement | undefined)[] = (
        Object.keys(ManaColors) as ManaColorValue[]
      ).flatMap((colorValue: ManaColorValue) => {
        const manaColor = ManaColors[colorValue];
        const numMana = this.card.mana[colorValue];
        return numMana ? Array(numMana).fill(manaColor.img) : [];
      });
      if (manaImgs.every((img) => !!img)) {
        manaImgs.forEach((img, index) => {
          const diameter = 8;
          const imgSize = 7;
          const x = 122 + (1 + (2 * diameter) / 2) * (index - manaImgs.length);
          const y = 13;
          ctx.fillStyle = "darkgrey";
          ctx.beginPath();
          ctx.arc(x, y, diameter / 2, 0, 2 * Math.PI);
          ctx.fill();
          ctx.drawImage(
            img,
            x - imgSize / 2,
            y - imgSize / 2,
            imgSize,
            imgSize
          );
        });
      }

      // Title
      ctx.font = `bold ${Configure.card_font_str}`;
      ctx.fillStyle = "black";
      ctx.fillText(this.card.name, 11, 16);

      // Traits
      if (this.card.traits) {
        ctx.font = `bold ${Configure.card_secondary_font_str}`;
        ctx.fillStyle = "black";
        ctx.fillText(this.card.traits, 11, 106);
      }

      // Description
      if (this.card.description) {
        ctx.font = Configure.card_secondary_font_str;
        ctx.fillStyle = "black";
        wrapText(
          ctx,
          this.card.description,
          11,
          117,
          108,
          1 + Configure.card_secondary_font_size
        );
      }

      // Power & Toughness
      if (
        this.card.template.ptImg &&
        (this.card.power !== undefined || this.card.toughness !== undefined)
      ) {
        ctx.drawImage(this.card.template.ptImg, 98, 157, 23.5, 13);

        ctx.font = Configure.card_font_str;
        ctx.fillStyle = "black";
        const text = `${this.card.power ?? 0}/${this.card.toughness ?? 0}`;
        ctx.fillText(text, 109 - text.length, 165.5);
      }
    }
  }
}
