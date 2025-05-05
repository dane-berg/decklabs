import { loadOntoImage } from "../render/renderutil";
import { defaultTemplateValue, Templates, TemplateValue } from "./template";

export class Card {
  private _img = new Image();
  private imgLoaded: boolean = false;

  constructor(
    public readonly name: string,
    private readonly imgSrc: File | string,
    public readonly id: string,
    public readonly created: string,
    public readonly standard: boolean,
    public readonly templateValue: TemplateValue = defaultTemplateValue
  ) {
    this.init();
  }

  private async init() {
    this.imgLoaded = await loadOntoImage(this._img, this.imgSrc);
  }

  public getImg(): HTMLImageElement | undefined {
    return this.imgLoaded ? this._img : undefined;
  }

  public getTemplateImg(): HTMLImageElement | undefined {
    const template = Templates[this.templateValue];
    return template?.getImg();
  }
}
