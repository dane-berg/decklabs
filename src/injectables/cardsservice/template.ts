import { I18n } from "../i18n";
import { loadOntoImage } from "../render/renderutil";

export class Template {
  public readonly name: string;
  private readonly _img = new Image();
  private imgLoaded: boolean = false;

  constructor(
    public readonly value: string,
    private readonly nameKey: string,
    public readonly imgSrc: string
  ) {
    this.name = I18n.get(this.nameKey);
    this.init();
  }

  private async init() {
    this.imgLoaded = await loadOntoImage(this._img, this.imgSrc);
  }

  public getImg(): HTMLImageElement | undefined {
    return this.imgLoaded ? this._img : undefined;
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
  "colorless_template.png"
);

export const Templates: Record<TemplateValue, Template> = {
  colorless: defaultTemplate,
  black: new Template("black", "color-black", "black_template.png"),
  blue: new Template("blue", "color-blue", "blue_template.png"),
  gold: new Template("gold", "color-gold", "gold_template.png"),
  green: new Template("green", "color-green", "green_template.png"),
  red: new Template("red", "color-red", "red_template.png"),
  white: new Template("white", "color-white", "white_template.png"),
};
