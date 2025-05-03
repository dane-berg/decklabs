import { Configure } from "../configure";
import { loadOntoImage, Position, TransformData } from "../render/renderutil";

export class DropZone {
  private static readonly cardBackImg = new Image();
  public static readonly cardBackImgPromise = loadOntoImage(
    DropZone.cardBackImg,
    "card_back_bw.png"
  );
  public initPromise: Promise<boolean>;
  public renderData: TransformData = {
    x: 0,
    y: 0,
    rot: 0,
    scale: 1,
  };

  constructor() {
    this.initPromise = DropZone.cardBackImgPromise;
  }

  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.rotate(this.renderData.rot);
    ctx.drawImage(
      DropZone.cardBackImg,
      this.renderData.x - Configure.CARD_WIDTH / 2,
      this.renderData.y - Configure.CARD_HEIGHT / 2,
      Configure.CARD_WIDTH * this.renderData.scale,
      Configure.CARD_HEIGHT * this.renderData.scale
    );
    ctx.restore();
  }

  public drawAt(ctx: CanvasRenderingContext2D, renderData: Position) {
    this.renderData = { ...this.renderData, ...renderData };
    this.render(ctx);
  }
}
