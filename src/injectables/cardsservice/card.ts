import { loadOntoImage } from "../render/renderutil";
import { ManaColorValue } from "./manacolor";
import {
  defaultTemplateValue,
  Template,
  Templates,
  TemplateValue,
} from "./template";

export class Card {
  private _img = new Image();
  private imgLoaded: boolean = false;

  constructor(
    public readonly name: string,
    public readonly description: string = "",
    private readonly imgSrc: File | string,
    public readonly templateValue: TemplateValue = defaultTemplateValue,
    public readonly id: string,
    public readonly created: string,
    public readonly standard: boolean,
    public readonly mana: Partial<Record<ManaColorValue, number>> = {},
    public readonly traits: string = "",
    public readonly effect: string = "",
    public readonly power?: number,
    public readonly toughness?: number
  ) {
    this.init();
  }

  public get template(): Template {
    return Templates[this.templateValue];
  }

  private async init() {
    this.imgLoaded = await loadOntoImage(this._img, this.imgSrc);
  }

  public get img(): HTMLImageElement | undefined {
    return this.imgLoaded ? this._img : undefined;
  }
}
