import { Configure } from "../configure";
import { RootElement } from "../render/canvaselement";
import { Rect } from "../render/renderutil";
import { Game } from "./game";
import { PlayerMat } from "./playermat";

export class GameElement extends RootElement {
  private readonly playerOneMat: PlayerMat | undefined;
  private readonly playerTwoMat: PlayerMat | undefined;

  constructor(public game: Game) {
    super();
    this.playerOneMat = new PlayerMat(this.game, 1);
    this.addChild(this.playerOneMat, undefined, false);
    this.playerTwoMat = new PlayerMat(this.game, 2);
    this.addChild(this.playerTwoMat, undefined, false);
  }

  public override update(rect: Rect) {
    this.rd = { ...this.rd, ...rect };

    this.playerOneMat?.update({
      x: 0,
      y: this.rd.h / 2,
      w: this.rd.w,
      h: this.rd.h / 2,
    });
    this.playerTwoMat?.update({ x: 0, y: 0, w: this.rd.w, h: this.rd.h / 2 });

    if (!this.game?.initialized) {
      Configure.DEBUG_MODE &&
        console.log("game has not finished initializing!");
      return;
    }
  }
}
