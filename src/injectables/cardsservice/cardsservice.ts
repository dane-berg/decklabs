import axios from "axios";
import { Card } from "./card";
import { Configure } from "../configure";
import { TemplateValue } from "./template";
import { ManaColorValue } from "./manacolor";

// singleton injectable that handles all cards
export class CardsService {
  private static cards: Card[] = [
    new Card(
      "Colorless Template",
      "weooweeoo",
      "colorless_mana.png",
      TemplateValue.Gold,
      "-1",
      new Date().toISOString(),
      true,
      { [ManaColorValue.Colorless]: 1 },
      "Weird",
      ""
    ),
    new Card(
      "White Template",
      "",
      "white_mana.png",
      TemplateValue.White,
      "-2",
      new Date().toISOString(),
      true,
      { [ManaColorValue.Colorless]: 1, [ManaColorValue.White]: 1 },
      "Useless",
      "",
      0,
      0
    ),
    new Card(
      "Blue Template",
      "",
      "blue_mana.png",
      TemplateValue.Blue,
      "-3",
      new Date().toISOString(),
      true,
      { [ManaColorValue.Blue]: 3 },
      "Shield",
      "",
      0,
      1
    ),
    new Card(
      "Black Template",
      "rawr",
      "black_mana.png",
      TemplateValue.Black,
      "-4",
      new Date().toISOString(),
      true,
      { [ManaColorValue.Black]: 4 },
      "Smol Boi",
      "",
      2,
      2
    ),
    new Card(
      "Red Template",
      "ssssssssssss",
      "red_mana.png",
      TemplateValue.Red,
      "-5",
      new Date().toISOString(),
      true,
      { [ManaColorValue.Red]: 5 },
      "Vampire",
      "",
      3,
      3
    ),
    new Card(
      "Green Template",
      "",
      "green_mana.png",
      TemplateValue.Green,
      "-6",
      new Date().toISOString(),
      true,
      { [ManaColorValue.Green]: 6 },
      "Big Boi",
      "",
      4,
      4
    ),
  ];
  private static initPromise?: Promise<void>;

  private static async init() {
    if (!this.initPromise) {
      this.initPromise = this._findAll().then((cards) => {
        this.cards = [...this.cards, ...cards];
      });
    }
    return this.initPromise;
  }

  static async getAll(limit: number = 100): Promise<Card[]> {
    await this.init();
    return this.cards.slice(0, limit);
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

  static async create(
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
  }

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
        return { ...cardData, img: file };
      });
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
