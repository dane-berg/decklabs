import { CanvasElement } from "../render/canvaselement";
import { RenderData } from "../render/renderutil";
import { CardInPlay } from "./cardinplay";

export class LandArea extends CanvasElement {
  public override children: CardInPlay[] = [];

  public update(rd: Partial<RenderData>) {
    this._rd = { ...this._rd, ...rd };
  }
}
