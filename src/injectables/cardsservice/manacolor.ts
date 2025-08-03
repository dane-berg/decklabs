import { I18n } from "../i18n";
import { loadOntoImage } from "../render/renderutil";

export class ManaColor {
  public readonly name: string;
  private readonly _img = new Image();
  private imgLoaded: boolean = false;

  constructor(
    public readonly value: ManaColorValue,
    public readonly symbol: ManaColorSymbol,
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

  public get img(): HTMLImageElement | undefined {
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
export enum ManaColorSymbol {
  Colorless = "{C}",
  Black = "{B}",
  Blue = "{U}",
  Green = "{G}",
  Red = "{R}",
  White = "{W}",
}
export const defaultManaColorValue = ManaColorValue.Colorless;
export const defaultManaColor = new ManaColor(
  ManaColorValue.Colorless,
  ManaColorSymbol.Colorless,
  "color-colorless",
  "colorless_mana.png",
  0
);

export const ManaColors: Record<ManaColorValue, ManaColor> = {
  colorless: defaultManaColor,
  white: new ManaColor(
    ManaColorValue.White,
    ManaColorSymbol.White,
    "color-white",
    "white_mana.png",
    1
  ),
  blue: new ManaColor(
    ManaColorValue.Blue,
    ManaColorSymbol.Blue,
    "color-blue",
    "blue_mana.png",
    2
  ),
  black: new ManaColor(
    ManaColorValue.Black,
    ManaColorSymbol.Black,
    "color-black",
    "black_mana.png",
    3
  ),
  green: new ManaColor(
    ManaColorValue.Green,
    ManaColorSymbol.Green,
    "color-green",
    "green_mana.png",
    4
  ),
  red: new ManaColor(
    ManaColorValue.Red,
    ManaColorSymbol.Red,
    "color-red",
    "red_mana.png",
    5
  ),
};
export function isManaColorValue(value: string): value is ManaColorValue {
  return Object.keys(ManaColors).includes(value);
}
export const allManaColorValues = Object.keys(ManaColors) as ManaColorValue[];
export const allManaColorSymbols = allManaColorValues.map(
  (manaColorValue) => ManaColors[manaColorValue].symbol
);
