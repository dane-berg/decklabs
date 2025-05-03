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
