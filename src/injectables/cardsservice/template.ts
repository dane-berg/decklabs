import { I18n } from "../i18n";
import { loadOntoImage } from "../render/renderutil";

export class Template {
  public readonly name: string;
  private readonly _img = new Image();
  private imgLoaded: boolean = false;
  private readonly _ptImg = new Image();
  private ptImgLoaded: boolean = false;

  constructor(
    public readonly value: string,
    private readonly nameKey: string,
    public readonly imgSrc: string,
    public readonly ptImgSrc: string
  ) {
    this.name = I18n.get(this.nameKey);
    this.init();
  }

  private async init() {
    this.imgLoaded = await loadOntoImage(this._img, this.imgSrc);
    this.ptImgLoaded = await loadOntoImage(this._ptImg, this.ptImgSrc);
  }

  public get img(): HTMLImageElement | undefined {
    return this.imgLoaded ? this._img : undefined;
  }

  public get ptImg(): HTMLImageElement | undefined {
    return this.ptImgLoaded ? this._ptImg : undefined;
  }
}

export enum TemplateValue {
  Colorless = "colorless",
  Black = "black",
  Blue = "blue",
  Gold = "gold",
  Green = "green",
  Red = "red",
  White = "white",
}
export const defaultTemplateValue = TemplateValue.Colorless;
export const defaultTemplate = new Template(
  TemplateValue.Colorless,
  "color-colorless",
  "colorless_template.png",
  "colorless_pt.png"
);

export const Templates: Record<TemplateValue, Template> = {
  colorless: defaultTemplate,
  black: new Template(
    "black",
    "color-black",
    "black_template.png",
    "colorless_pt.png"
  ),
  blue: new Template("blue", "color-blue", "blue_template.png", "blue_pt.png"),
  gold: new Template("gold", "color-gold", "gold_template.png", "gold_pt.png"),
  green: new Template(
    "green",
    "color-green",
    "green_template.png",
    "green_pt.png"
  ),
  red: new Template("red", "color-red", "red_template.png", "red_pt.png"),
  white: new Template(
    "white",
    "color-white",
    "white_template.png",
    "white_pt.png"
  ),
};
