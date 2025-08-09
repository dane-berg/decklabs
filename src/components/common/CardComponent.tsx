import { Card } from "../../injectables/cardsservice/card";
import { Configure } from "../../injectables/configure";
import { CardElement } from "../../injectables/game/cardelement";
import CanvasComponent from "./CanvasComponent";

interface Inputs {
  style?: any;
  card: Card;
  fullCard?: boolean;
}

const CardComponent = ({ style, card, fullCard }: Inputs) => {
  const cardElement = new CardElement(card);
  cardElement.fullArt = fullCard ?? true;

  return (
    <CanvasComponent
      style={style}
      aspectRatio={
        (fullCard ? Configure.CARD_HEIGHT : Configure.CONDENSED_CARD_HEIGHT) /
        Configure.CARD_WIDTH
      }
      rootElement={cardElement}
    />
  );
};

export default CardComponent;
