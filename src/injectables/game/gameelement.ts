import { Configure } from "../configure";
import { RootElement } from "../render/canvaselement";
import { Rect } from "../render/renderutil";
import { Game } from "./game";

export class GameElement extends RootElement {
  constructor(public game: Game) {
    super();
    this.addChild(game.playerPlayArea, undefined, false);
    this.addChild(game.playerHand, undefined, false);
  }

  public override update(rect: Rect) {
    this.rd = { ...this.rd, ...rect };

    this.game.playerPlayArea.update({
      x: 0,
      y: this.rd.h / 2,
      w: this.rd.w,
      h: this.rd.h / 2 - Configure.CARD_HEIGHT * Configure.NONOVERLAP_RATIO,
    });
    this.game.playerHand.update({
      x: 0,
      y: this.rd.h - Configure.CARD_HEIGHT,
      w: this.rd.w,
      h: Configure.CARD_HEIGHT,
    });

    if (!this.game.initialized) {
      console.log("game has not finished initializing!");
      return;
    }
  }
}
