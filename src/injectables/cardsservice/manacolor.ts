import { I18n } from "../i18n";
import { loadOntoImage } from "../render/renderutil";

export class ManaColor {
  public readonly name: string;
  private readonly _img = new Image();
  private imgLoaded: boolean = false;

  constructor(
    public readonly value: ManaColorValue,
    private readonly nameKey: string,
    public readonly imgSrc: string,
    public readonly sortIndex: number
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

export enum ManaColorValue {
  Colorless = "colorless",
  Black = "black",
  Blue = "blue",
  Green = "green",
  Red = "red",
  White = "white",
}
export const defaultManaColorValue = ManaColorValue.Colorless;
export const defaultManaColor = new ManaColor(
  ManaColorValue.Colorless,
  "color-colorless",
  "colorless_mana.png",
  0
);

export const ManaColors: Record<ManaColorValue, ManaColor> = {
  colorless: defaultManaColor,
  white: new ManaColor(
    ManaColorValue.White,
    "color-white",
    "white_mana.png",
    1
  ),
  blue: new ManaColor(ManaColorValue.Blue, "color-blue", "blue_mana.png", 2),
  black: new ManaColor(
    ManaColorValue.Black,
    "color-black",
    "black_mana.png",
    3
  ),
  green: new ManaColor(
    ManaColorValue.Green,
    "color-green",
    "green_mana.png",
    4
  ),
  red: new ManaColor(ManaColorValue.Red, "color-red", "red_mana.png", 5),
};
