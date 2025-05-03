import { Configure } from "../configure";

export class Card {
  public readonly name: string;
  public readonly imgFile: File | string;
  private _img?: HTMLImageElement;
  public readonly id: string;
  public readonly created: string;
  public readonly standard: boolean;

  constructor(
    name: string,
    imgFile: File | string,
    id: string,
    created: string,
    standard: boolean
  ) {
    this.name = name;
    this.imgFile = imgFile;
    this.id = id;
    this.created = created;
    this.standard = standard;
  }

  public get img(): HTMLImageElement {
    if (!this._img) {
      this._img = new Image();
      if (typeof this.imgFile === "string") {
        this._img.src = this.imgFile;
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.img.src = reader.result as string;
        };
        reader.readAsDataURL(this.imgFile);
      }
    }
    return this._img;
  }
}

export function drawCard(
  ctx: CanvasRenderingContext2D,
  card: Card,
  x: number,
  y: number,
  scale: number = 1.0
) {
  ctx.drawImage(
    card.img,
    x - Configure.CARD_WIDTH / 2,
    y - Configure.CARD_HEIGHT / 2,
    Configure.CARD_WIDTH * scale,
    Configure.CARD_HEIGHT * scale
  );
}
