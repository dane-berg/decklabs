import { loadOntoImage } from "../render/renderutil";

export class Card {
  private _img = new Image();
  private imgLoaded: boolean = false;

  constructor(
    public readonly name: string,
    private readonly imgSrc: File | string,
    public readonly id: string,
    public readonly created: string,
    public readonly standard: boolean
  ) {
    this.init();
  }

  private async init() {
    this.imgLoaded = await loadOntoImage(this._img, this.imgSrc);
  }

  public getImg(): HTMLImageElement | undefined {
    return this.imgLoaded ? this._img : undefined;
  }
}
