import axios from "axios";
import { Card } from "./card";
import { Configure } from "../configure";

/**constructor(
    name: string,
    imgFile: File,
    id: string,
    created: string,
    standard: boolean
  ) */

// singleton injectable that handles all cards
export class CardsService {
  private static cards: Card[] = [
    new Card(
      "Red Template",
      "red_template.png",
      "1000",
      new Date().toISOString(),
      true
    ),
    new Card(
      "Green Template",
      "green_template.png",
      "1001",
      new Date().toISOString(),
      true
    ),
    new Card(
      "Blue Template",
      "blue_template.png",
      "1002",
      new Date().toISOString(),
      true
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
    return this.cards;
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
        return { ...cardData, img: file };
      });
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
