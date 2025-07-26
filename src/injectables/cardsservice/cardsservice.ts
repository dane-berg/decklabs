import axios from "axios";
import { Card, CardData } from "./card";
import { Configure } from "../configure";

// singleton injectable that handles all cards
export class CardsService {
  private static cards = new Map<number, Card>();
  private static lastLocalCardId: number = 0; // decrements
  private static initPromise?: Promise<void>;
  private static lastModifiedCard?: Card;

  private static async init() {
    if (!this.initPromise) {
      this.initPromise = this._getAll().then((cards) =>
        cards.forEach((card) => this.cards.set(card.id, card))
      );
    }
    return this.initPromise;
  }

  static getLastModifiedCard(fallbackCardData: CardData): Card {
    if (
      !this.lastModifiedCard ||
      !this.lastModifiedCard.isModifiable ||
      !this.cards.has(this.lastModifiedCard.id)
    ) {
      this.lastModifiedCard = this.createCard(fallbackCardData);
    }
    return this.lastModifiedCard;
  }

  static createCard(data: CardData): Card {
    const id = --this.lastLocalCardId;
    console.log(`creating new card with id ${id} ...`);
    const newCard = new Card(id, data);
    this.cards.set(id, newCard);
    return newCard;
  }

  private static getLocalCard(id: number): Card {
    if (id < this.lastLocalCardId || id >= 0) {
      throw new Error(
        `invalid local card id=${id} when lastLocalCardId=${this.lastLocalCardId}`
      );
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

  static async getAll(): Promise<Card[]> {
    await this.init();
    return [...this.cards.values()].filter(
      (card) => card !== this.getLastModifiedCard({ name: "Untitled Card" })
    );
  }

  static async publishCard(card: Card): Promise<boolean> {
    const localCard = this.getLocalCard(card.id);

    const formData = new FormData();
    formData.append("name", localCard.name);
    formData.append("metadata", JSON.stringify(localCard.metadata));
    formData.append("description", localCard.description);
    formData.append("img", localCard.imgSrc);
    formData.append("templateValue", localCard.templateValue);
    formData.append("manaString", localCard.manaString);
    formData.append("traits", localCard.traits);
    formData.append("effect", localCard.effect);
    if (localCard.power !== undefined) {
      formData.append("power", `${localCard.power}`);
    }
    if (localCard.toughness !== undefined) {
      formData.append("toughness", `${localCard.toughness}`);
    }

    try {
      const response = await axios.post(`${Configure.url}cards`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const cardData = response.data.data;
      console.log(`Upload successful`);
      console.log(cardData);

      if (cardData.id === undefined) {
        throw new Error(`received id must not be undefined`);
      }
      if (cardData.id <= 0) {
        throw new Error(`expected positive id, but got ${cardData.id}`);
      }
      if (this.cards.has(cardData.id)) {
        throw new Error(`expected unique id, but got collision ${cardData.id}`);
      }
      const newCard = new Card(cardData.id, cardData);
      this.cards.set(cardData.id, newCard);
      this.cards.delete(localCard.id);
      return true;
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      return false;
    }
  }

  /**@Get(':id')
    findCard(@Param() id: string) {
      console.log(id);
      const card = this.cardsService.findCard(id);
      if (!card) {
        return new HttpException('Card not found', HttpStatus.NOT_FOUND);
      }
      return card;
    }*/

  private static async _getAll(): Promise<Card[]> {
    try {
      const response = await axios.get(`${Configure.url}cards/`, {
        sort: "asc",
      } as any);
      console.log("getAllCards response:");
      console.log(response.data);
      return response.data.map(
        (cardData: CardData) => new Card(cardData.id, cardData)
      );
    } catch (e) {
      console.log(e);
      return [];
    }
  }
}
