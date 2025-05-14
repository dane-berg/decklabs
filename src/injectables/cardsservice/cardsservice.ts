import axios from "axios";
import { Card, CardData } from "./card";
import { Configure } from "../configure";
import { TemplateValue } from "./template";
import { ManaColorValue } from "./manacolor";

// singleton injectable that handles all cards
export class CardsService {
  private static debugCards: CardData[] = [
    {
      name: "Colorless Template",
      description: "weooweeoo",
      imgSrc: "colorless_mana.png",
      templateValue: TemplateValue.Gold,
      mana: { [ManaColorValue.Colorless]: 1 },
      traits: "Weird",
    },
    {
      name: "White Template",
      imgSrc: "white_mana.png",
      templateValue: TemplateValue.White,
      mana: { [ManaColorValue.Colorless]: 1, [ManaColorValue.White]: 1 },
      traits: "Useless",
      power: 0,
      toughness: 0,
    },
    {
      name: "Blue Template",
      imgSrc: "blue_mana.png",
      templateValue: TemplateValue.Blue,
      mana: { [ManaColorValue.Blue]: 3 },
      traits: "Shield",
      power: 0,
      toughness: 1,
    },
    {
      name: "Black Template",
      description: "rawr",
      imgSrc: "black_mana.png",
      templateValue: TemplateValue.Black,
      mana: { [ManaColorValue.Black]: 4 },
      traits: "Smol Boi",
      power: 2,
      toughness: 2,
    },
    {
      name: "Red Template",
      description: "ssssssssssss",
      imgSrc: "red_mana.png",
      templateValue: TemplateValue.Red,
      mana: { [ManaColorValue.Red]: 5 },
      traits: "Vampire",
      power: 3,
      toughness: 3,
    },
    {
      name: "Green Template",
      imgSrc: "green_mana.png",
      templateValue: TemplateValue.Green,
      mana: { [ManaColorValue.Green]: 6 },
      traits: "Big Boi",
      power: 4,
      toughness: 4,
    },
  ];
  private static cards = new Map<number, Card>();
  private static lastLocalCardId: number = 0; // decrements
  private static initPromise?: Promise<void>;

  private static async init() {
    if (!this.initPromise) {
      this.debugCards.forEach((localCardData) => {
        const id = --this.lastLocalCardId;
        this.cards.set(id, new Card(id, localCardData));
      });
      this.initPromise = this._findAll().then((cards) =>
        cards.forEach((card) => this.cards.set(card.id, card))
      );
    }
    return this.initPromise;
  }

  static createCard(data: CardData): Card {
    debugger;
    const id = --this.lastLocalCardId;
    console.log(`creating new card with id ${id} ...`);
    const newCard = new Card(id, data);
    this.cards.set(id, newCard);
    return newCard;
  }

  private static getLocalCard(id: number): Card {
    if (id < this.lastLocalCardId || id >= 0) {
      throw new Error("invalid local card id");
    }
    const card = this.cards.get(id);
    if (!card) {
      throw new Error(`no card found with id ${id}`);
    }
    return card;
  }

  static updateCard(id: number, data: CardData) {
    console.log(`updating card with id ${id} ...`);
    this.getLocalCard(id).update(data);
  }

  static async getAll(limit: number = 100): Promise<Card[]> {
    await this.init();
    return [...this.cards.values()].slice(0, limit);
  }

  static async publishCard(card: Card): Promise<boolean> {
    const localCard = this.getLocalCard(card.id);
    // TODO: send a request
    const response = false;
    if (response) {
      // TODO: add the new id to this.aliases
      // TODO: updated created date ?
      return true;
    } else {
      return false;
    }
  }

  /**@Get('standard')
    findStandard() {
      return this.cardsService.findStandard();
    }
  
    @Get(':id')
    findCard(@Param() id: string) {
      console.log(id);
      const card = this.cardsService.findCard(id);
      if (!card) {
        return new HttpException('Card not found', HttpStatus.NOT_FOUND);
      }
      return card;
    }*/

  /*static async create(
    name: string,
    imgFile: File,
    onUploadProgress?: (progressEvent: any) => void
  ) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("img", imgFile);
    await axios.post(`${Configure.url}cards/`, formData, {
      onUploadProgress: onUploadProgress,
    });
    // TODO: await the response w/ card id etc, & add it to cards array
  }*/

  private static async _findAll(): Promise<Card[]> {
    try {
      const response = await axios.get(`${Configure.url}cards/`, {
        sort: "asc",
      } as any);
      console.log("findAll response:");
      console.log(response.data);
      return response.data.map((cardData) => {
        // parse each image file
        const uint8Array = new Uint8Array(cardData.img.buffer.data);
        const blob = new Blob([uint8Array], { type: cardData.img.mimetype });
        const file = new File([blob], cardData.img.name, {
          type: cardData.img.mimetype,
        });
        // TODO: call the Card constructor
        return { ...cardData, imgSrc: file };
      });
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
