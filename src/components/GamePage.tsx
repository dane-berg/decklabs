import { Game } from "../injectables/game/game";
import { GameElement } from "../injectables/game/gameelement";
import CanvasComponent from "./common/CanvasComponent";

interface Inputs {
  game: Game;
}

const GamePage = ({ game }: Inputs) => {
  return (
    <CanvasComponent
      backgroundImg="parchment.jpg"
      rootElement={new GameElement(game)}
    />
  );
};

export default GamePage;
