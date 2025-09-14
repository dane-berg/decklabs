import { ButtonElement } from "../canvaselements/button.element";
import { Configure } from "../configure";
import { I18n } from "../i18n";
import { CanvasElement, ZIndex } from "../render/canvaselement";
import { Rect } from "../render/renderutil";
import { Game } from "./game";
import { GameActionType } from "./gameaction";

export class PlayerMat extends CanvasElement {
  private endTurnButton: ButtonElement | undefined;

  constructor(
    private readonly game: Game,
    private readonly playerIndex: 1 | 2
  ) {
    super();
    const zIndex = this.playerIndex === 1 ? undefined : ZIndex.NonInteractive;
    this.addChild(this.player.playArea, zIndex, false);
    this.addChild(this.player.landArea, zIndex, false);
    this.addChild(this.player.mana, zIndex, false);
    this.addChild(this.player.hand, zIndex, false);
  }

  // this must be a getter instead of a property because properties are initialized before super() is called
  private get player() {
    return this.playerIndex === 1 ? this.game.playerOne : this.game.playerTwo;
  }

  public update(rect: Rect) {
    this.rd = { ...this.rd, ...rect };

    if (this.playerIndex === 1) {
      if (!this.endTurnButton) {
        this.endTurnButton = new ButtonElement(
          I18n.get("end-turn"),
          async () => {
            await this.game.applyActionIfVerified({
              type: GameActionType.EndTurn,
              playerIndex: this.playerIndex,
            });
          }
        );
        this.endTurnButton && this.addChild(this.endTurnButton, ZIndex.UI);
      }
      this.endTurnButton.update(
        this.game.activePlayer === this.player
          ? {
              x: this.rd.w - 220,
              y: this.rd.h - 210,
              w: 120,
              h: 35,
            }
          : { x: this.rd.w - 220, y: this.rd.h - 210, w: 0, h: 0 }
      );
    }
    this.player.playArea.update({
      x: 0,
      y: this.rd.h / 2,
      w: this.rd.w,
      h: this.rd.h / 2 - Configure.CARD_HEIGHT,
    });
    // TODO: shrink after implementing condensed card elements
    this.player.landArea.update({
      x: 0,
      y: (this.rd.h * 2) / 3,
      w: this.rd.w / 2,
      h: Configure.CARD_HEIGHT,
    });
    this.player.mana.update({
      x: 0,
      y: this.rd.h - 50,
      w: 300,
      h: 300,
    });
    this.player.hand.update({
      x: 0,
      y: this.rd.h - Configure.CARD_HEIGHT,
      w: this.rd.w,
      h: Configure.CARD_HEIGHT,
    });
  }
}
