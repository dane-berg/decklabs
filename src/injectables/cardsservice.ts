import axios from "axios";
import { Configure } from "./configure";

export type Card = {
  name: string;
  img: File;
  id: string;
  created: string;
  standard: boolean;
};

export class CardsService {
  private static findAllPromise?: Promise<Card[]>;
  private static async _findAll(): Promise<Card[]> {
    try {
      const response = await axios.get(`${Configure.url}cards/`, {
        sort: "asc",
      } as any);
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
  static async findAll(): Promise<Card[]> {
    if (!this.findAllPromise) {
      this.findAllPromise = this._findAll();
    }
    return this.findAllPromise;
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
    img: File,
    onUploadProgress?: (progressEvent: any) => void
  ) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("img", img);
    await axios.post(`${Configure.url}cards/`, formData, {
      onUploadProgress: onUploadProgress,
    });
  }
}
