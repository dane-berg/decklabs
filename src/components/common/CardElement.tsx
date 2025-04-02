import React from "react";
import { Card } from "../../injectables/cardsservice";

interface Inputs {
  card: Card;
}

const CardElement = ({ card }: Inputs) => {
  return <div style={{ width: "100px", height: "150px" }}>{card.name}</div>;
};

export default CardElement;
