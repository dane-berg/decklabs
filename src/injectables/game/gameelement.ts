import { Configure } from "../configure";
import { RootElement } from "../render/canvaselement";
import { Rect } from "../render/renderutil";
import { Game } from "./game";

export class GameElement extends RootElement {
  constructor(public game: Game) {
    super();
    this.addChild(game.playerPlayArea, false);
    this.addChild(game.playerHand, false);
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
      x: this.rd.w / 4,
      y: this.rd.h,
      w: this.rd.w / 2,
      h: 0,
    });

    if (!this.game.initialized) {
      console.log("game has not finished initializing!");
      return;
    }
  }
}
