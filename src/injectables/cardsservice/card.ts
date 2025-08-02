import { Configure } from "../configure";
import { isTrait, Trait } from "../game/traits";
import { loadOntoImage } from "../render/renderutil";
import { isManaColorValue, ManaColors, ManaColorValue } from "./manacolor";
import {
  defaultTemplateValue,
  Template,
  Templates,
  TemplateValue,
} from "./template";

export type CardId = number;
export type Mana = Partial<Record<ManaColorValue, number>>;

export type StrictCardData = {
  name: string;
  created: string;
  metadata: Record<string, string>;
  description: string;
  imgSrc: File | string;
  templateValue: TemplateValue;
  mana: Mana;
  manaString: string;
  traits: string;
  effect: string;
  power: number | undefined;
  toughness: number | undefined;
};

export type CardData = { name: string } & Partial<StrictCardData>;

const manaDelimiter = ",";

export class Card {
  private _created: string;
  private _img = new Image();
  private imgLoaded: boolean = false;

  constructor(
    public readonly id: CardId,
    private data: CardData
  ) {
    this._created = this.data.created ?? new Date().toISOString();
    this.init();
  }

  private async init() {
    this.imgLoaded = await loadOntoImage(this._img, this.imgSrc);
    if (!this.id) {
      throw new Error("card id must not be undefined");
    }
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

  public get metadata(): Record<string, string> {
    return this.data.metadata ?? {};
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

  public get imgSrc(): File | string {
    return this.data.imgSrc || Configure.default_card_art_src;
  }

  public get templateValue(): TemplateValue {
    return this.data.templateValue ?? defaultTemplateValue;
  }

  public get template(): Template {
    return Templates[this.templateValue];
  }

  public get mana(): Mana {
    if (this.data.mana) {
      return this.data.mana;
    } else if (this.data.manaString) {
      return parseManaString(this.data.manaString);
    } else {
      return {};
    }
  }

  public get manaString(): string {
    if (this.data.manaString) {
      return this.data.manaString;
    } else if (this.data.mana) {
      return manaToString(this.data.mana);
    } else {
      return "";
    }
  }

  public get traits(): string {
    return this.data.traits ?? "";
  }

  public get traitsList(): Trait[] {
    return this.traits.split(" ").filter((word) => isTrait(word));
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

  public get isPublished(): boolean {
    return this.id > 0;
  }

  public get isModifiable(): boolean {
    return this.id < 0;
  }
}

export function manaToString(manaObj: Mana): string {
  const mana: string[] = [];
  (Object.keys(ManaColors) as ManaColorValue[]).forEach((manaColorValue) => {
    const n = manaObj[manaColorValue];
    if (n) {
      mana.push(...Array(n).fill(manaColorValue));
    }
  });
  return mana.join(manaDelimiter);
}

export function parseManaString(manaString: string): Mana {
  const mana: Mana = {};
  manaString.split(manaDelimiter).forEach((manaColorValue) => {
    if (isManaColorValue(manaColorValue)) {
      mana[manaColorValue] = 1 + (mana[manaColorValue] ?? 0);
    }
  });
  return mana;
}
