import { Mana } from "../cardsservice/card";
import { allManaColorValues } from "../cardsservice/manacolor";
import { CanvasElement } from "../render/canvaselement";
import { RenderData, wrapText } from "../render/renderutil";

export class ManaDisplay extends CanvasElement {
  constructor(
    public readonly mana: Mana = {},
    public readonly maxMana: Mana = {}
  ) {
    super();
  }

  public update(rd: Partial<RenderData>) {
    this._rd = { ...this._rd, ...rd };
  }

  public override draw(ctx: CanvasRenderingContext2D) {
    wrapText(
      ctx,
      allManaColorValues
        .map(
          (value) =>
            `${value} ${this.mana[value] || 0} / ${this.maxMana[value] || 0}`
        )
        .join(", "),
      0,
      0,
      this._rd.w,
      22
    );
  }
}
