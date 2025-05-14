import { loadOntoImage } from "../render/renderutil";
import { ManaColorValue } from "./manacolor";
import {
  defaultTemplateValue,
  Template,
  Templates,
  TemplateValue,
} from "./template";

export type CardData = {
  created?: string;
  metadata?: Record<string, string>;
  name: string;
  description?: string;
  imgSrc?: File | string;
  templateValue?: TemplateValue;
  mana?: Partial<Record<ManaColorValue, number>>;
  traits?: string;
  effect?: string;
  power?: number;
  toughness?: number;
};

export class Card {
  private _created: string;
  private _img = new Image();
  private imgLoaded: boolean = false;

  constructor(public readonly id: number, private data: CardData) {
    this._created = this.data.created ?? new Date().toISOString();
    this.init();
  }

  private async init() {
    if (this.data.imgSrc) {
      this.imgLoaded = await loadOntoImage(this._img, this.data.imgSrc);
    }
    // TODO: else use a default image
  }

  /**
   * Do not call this outside of cardsservice.ts
   */
  public update(data: CardData) {
    this.data = data;
    this.imgLoaded = false;
    this.init();
  }

  public get created(): string {
    return this._created;
  }

  public getMetadata(key: string): string | undefined {
    return this.data.metadata?.[key];
  }

  public get name(): string {
    return this.data.name;
  }

  public get description(): string {
    return this.data.description ?? "";
  }

  public get img(): HTMLImageElement | undefined {
    return this.imgLoaded ? this._img : undefined;
  }

  public get template(): Template {
    return Templates[this.data.templateValue ?? defaultTemplateValue];
  }

  public get mana(): Partial<Record<ManaColorValue, number>> {
    return this.data.mana ?? {};
  }

  public get traits(): string {
    return this.data.traits ?? "";
  }

  public get effect(): string {
    return this.data.effect ?? "";
  }

  public get power(): number | undefined {
    return this.data.power;
  }

  public get toughness(): number | undefined {
    return this.data.toughness;
  }
}
