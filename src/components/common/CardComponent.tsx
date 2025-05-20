import { Card } from "../../injectables/cardsservice/card";
import { Configure } from "../../injectables/configure";
import { CardElement } from "../../injectables/game/cardelement";
import CanvasComponent from "./CanvasComponent";

interface Inputs {
  style?: any;
  card: Card;
}

const CardComponent = ({ style, card }: Inputs) => {
  return (
    <CanvasComponent
      style={style}
      aspectRatio={Configure.CARD_HEIGHT / Configure.CARD_WIDTH}
      rootElement={new CardElement(card)}
    />
  );
};

export default CardComponent;
