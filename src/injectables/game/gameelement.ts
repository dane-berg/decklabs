import { ButtonElement } from "../canvaselements/button.element";
import { Configure } from "../configure";
import { I18n } from "../i18n";
import { RootElement, ZIndex } from "../render/canvaselement";
import { Rect } from "../render/renderutil";
import { Game } from "./game";
import { GameActionType } from "./gameaction";

export class GameElement extends RootElement {
  private readonly endTurnButton = new ButtonElement(
    I18n.get("end-turn"),
    async () => {
      await this.game.applyActionIfVerified({ type: GameActionType.EndTurn });
    }
  );

  constructor(public game: Game) {
    super();
    this.addChild(this.endTurnButton, ZIndex.UI);
    this.addChild(game.playerPlayArea, undefined, false);
    this.addChild(game.playerLandArea, undefined, false);
    this.addChild(game.playerMana, undefined, false);
    this.addChild(game.playerHand, undefined, false);
  }

  public override update(rect: Rect) {
    this.rd = { ...this.rd, ...rect };

    this.endTurnButton.update({
      x: this.rd.w - 220,
      y: this.rd.h - 210,
      w: 120,
      h: 35,
    });
    this.game.playerPlayArea.update({
      x: 0,
      y: this.rd.h / 2,
      w: this.rd.w,
      h: this.rd.h / 2 - Configure.CARD_HEIGHT,
    });
    // TODO: shrink after implementing condensed card elements
    this.game.playerLandArea.update({
      x: 0,
      y: (this.rd.h * 2) / 3,
      w: this.rd.w / 2,
      h: Configure.CARD_HEIGHT,
    });
    this.game.playerMana.update({ x: 0, y: this.rd.h - 50, w: 300, h: 300 });
    this.game.playerHand.update({
      x: 0,
      y: this.rd.h - Configure.CARD_HEIGHT,
      w: this.rd.w,
      h: Configure.CARD_HEIGHT,
    });

    if (!this.game.initialized) {
      Configure.DEBUG_MODE &&
        console.log("game has not finished initializing!");
      return;
    }
  }
}
