import axios from "axios";
import { Configure } from "./configure";

export type Card = {
  name: string;
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
      console.log(response);
      return response.data;
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
    onUploadProgress?: (progressEvent: any) => void
  ) {
    await axios.post(
      `${Configure.url}cards/`,
      { name: name },
      { onUploadProgress: onUploadProgress }
    );
  }
}
