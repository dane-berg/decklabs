import { Configure } from "../configure";
import { CanvasElement, ZIndex } from "../render/canvaselement";
import { add, Rect, TransformData } from "../render/renderutil";
import { CardElement } from "./cardelement";
import { CardInPlay } from "./cardinplay";

const RADIUS_SCALING = 3.6; // should be > 1;

export class Hand extends CanvasElement {
  public override children: CardInPlay[] = [];

  public update(rect: Rect) {
    this.rd = { ...this.rd, ...rect };

    const radius = this.rd.w * RADIUS_SCALING;
    const lastHoveredIndex = CardElement.lastHoveredCard
      ? this.children
          .map((cardInPlay) => cardInPlay.children[0])
          .indexOf(CardElement.lastHoveredCard)
      : -1;
    function getCardRenderData(
      w: number,
      n: number,
      i: number,
      alignment: "left" | "right" | "center" = "center"
    ): TransformData {
      switch (alignment) {
        case "center": {
          let dx = i - 0.5 * (n - 1);
          dx *= Math.min(
            Configure.CARD_WIDTH * Configure.NONOVERLAP_RATIO,
            w / n
          );
          return {
            x: w / 2 + dx,
            y: Configure.CARD_HEIGHT / 2,
            rot: 0,
            scale: 1,
          };
        }
        case "left": {
          let dx = i - 0.5 * (n - 1);
          dx *= Math.min(
            Configure.CARD_WIDTH * Configure.NONOVERLAP_RATIO,
            w / n
          );
          return {
            x: w / 2 + dx,
            y: Configure.CARD_HEIGHT / 2,
            rot: 0,
            scale: 1,
          };
        }
        case "right": {
          let dx = i - 0.5 * (n - 1);
          dx *= Math.min(
            Configure.CARD_WIDTH * Configure.NONOVERLAP_RATIO,
            w / n
          );
          return {
            x: w / 2 + dx,
            y: Configure.CARD_HEIGHT / 2,
            rot: 0,
            scale: 1,
          };
        }
      }
    }

    if (lastHoveredIndex > -1) {
      const hoveredRenderData = {
        ...getCardRenderData(this.rd.w, this.children.length, lastHoveredIndex),
        scale: Configure.HOVERED_SCALE,
      };
      this.children.forEach((card, index) => {
        if (index === lastHoveredIndex) {
          card.update(hoveredRenderData, 0);
          card.zIndex = ZIndex.Selection;
        } else if (index < lastHoveredIndex) {
          card.update(
            getCardRenderData(
              hoveredRenderData.x,
              lastHoveredIndex,
              index,
              "right"
            )
          );
          card.zIndex = ZIndex.HandCard;
        } else {
          card.update(
            add(
              getCardRenderData(
                this.rd.w -
                  hoveredRenderData.x -
                  Configure.CARD_WIDTH * hoveredRenderData.scale,
                this.children.length - lastHoveredIndex - 1,
                index - lastHoveredIndex - 1,
                "left"
              ),
              {
                x:
                  hoveredRenderData.x +
                  Configure.CARD_WIDTH * hoveredRenderData.scale,
                y: 0,
                rot: 0,
                scale: 0,
              }
            )
          );
          card.zIndex = ZIndex.HandCard;
        }
      });
    } else {
      this.children.forEach((card, index) => {
        card.update(
          getCardRenderData(this.rd.w, this.children.length, index, "left")
        );
        card.zIndex = ZIndex.HandCard;
      });
    }

    /*this.children.forEach((card: CardInPlay, index: number) => {
      let dx = index - 0.5 * (this.children.length - 1);
      dx *= Configure.CARD_WIDTH * Configure.NONOVERLAP_RATIO;
      let dy = 1 + Configure.NONOVERLAP_RATIO;
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
            y: dy / Configure.NONOVERLAP_RATIO, // TODO: move hovered card upwards
            rot: 0,
            scale: 2,
          },
          0
        );
        card.zIndex = ZIndex.Selection;
      } else {
        card.update({ x: this.rd.w / 2 + dx, y: dy, rot: angle, scale: 1 });
        card.zIndex = ZIndex.HandCard;
      }
    });*/
  }
}
