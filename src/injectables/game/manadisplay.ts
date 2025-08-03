import { Mana } from "../cardsservice/card";
import { allManaColorValues } from "../cardsservice/manacolor";
import { CanvasElement } from "../render/canvaselement";
import { RenderData, wrapText } from "../render/renderutil";

export class ManaDisplay extends CanvasElement {
  constructor(public readonly mana: Mana = {}) {
    super();
  }

  public update(rd: Partial<RenderData>) {
    this._rd = { ...this._rd, ...rd };
  }

  public override draw(ctx: CanvasRenderingContext2D) {
    wrapText(
      ctx,
      allManaColorValues
        .filter((value) => this.mana[value])
        .map((value) => `${value} ${this.mana[value] || 0}`)
        .join(", "),
      0,
      0,
      this._rd.w,
      22
    );
  }
}
