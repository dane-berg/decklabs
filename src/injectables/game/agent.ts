import { Game } from "./game";
import { GameActionType } from "./gameaction";

export class Agent {
  constructor(private readonly game: Game) {}

  public async triggerNextAction(lastActionWasSuccessful: boolean) {
    // TODO
    this.game.applyActionIfVerified({
      type: GameActionType.EndTurn,
      playerIndex: 2,
    });
  }
}
