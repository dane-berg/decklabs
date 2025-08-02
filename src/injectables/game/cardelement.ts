import { Card } from "../cardsservice/card";
import {
  allManaColorValues,
  ManaColors,
  ManaColorValue,
} from "../cardsservice/manacolor";
import { Configure } from "../configure";
import { RootElement } from "../render/canvaselement";
import { Rect, wrapTextLines } from "../render/renderutil";

export class CardElement extends RootElement {
  public static lastHoveredCard?: CardElement;

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
      ctx.drawImage(this.card.img, 9, 20, 108, 78);

      // Template
      ctx.drawImage(
        this.card.template.img,
        0,
        0,
        Configure.CARD_WIDTH,
        Configure.CARD_HEIGHT
      );

      // Mana
      // TODO: Use numbers to condense the mana cost
      const manaImgs: (HTMLImageElement | undefined)[] =
        allManaColorValues.flatMap((colorValue: ManaColorValue) => {
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

      // Effect & Description
      if (this.card.effect || this.card.description) {
        wrapTextLines(
          ctx,
          [this.card.effect, this.card.description].filter(
            (t) => t !== undefined
          ),
          11,
          117,
          108,
          1 + Configure.card_secondary_font_size,
          Configure.card_secondary_font_str
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

  public override onMouseEnter() {
    CardElement.lastHoveredCard = this;
  }

  public override logName(): string {
    return `CardElement "${this.card.name}"`;
  }
}
