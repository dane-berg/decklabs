import { Configure } from "../configure";
import { CanvasElement } from "../render/canvaselement";
import { drawRoundedRect, Position, RenderData } from "../render/renderutil";

export class ButtonElement extends CanvasElement {
  constructor(
    public label: string,
    public override onClick: (pos: Position) => void | Promise<void> = () => {}
  ) {
    super();
  }

  public update(rd: Partial<RenderData>) {
    this._rd = { ...this._rd, ...rd };
  }

  public draw(ctx: CanvasRenderingContext2D) {
    drawRoundedRect(
      ctx,
      { x: 0, y: 0, w: this.rd.w, h: this.rd.h },
      8,
      this.isHovered ? "lightgrey" : "white",
      undefined,
      "lightgrey"
    );

    ctx.font = `${Configure.ui_font_str}`;
    ctx.fillStyle = "black";
    const textWidth = Math.min(this.rd.w, ctx.measureText(this.label).width);
    ctx.fillText(
      this.label,
      (this.rd.w - textWidth) / 2,
      this.rd.h / 2 + Configure.ui_font_size / 3
    );
  }
}
