import { Card } from "../../injectables/cardsservice";

interface Inputs {
  card: Card;
}

const CardElement = ({ card }: Inputs) => {
  const imgUrl = card.img && URL.createObjectURL(card.img);
  return (
    <div style={{ width: "234px", height: "333px" }}>
      <div>{card.name}</div>
      {card.img && (
        <img
          alt={card.name}
          src={imgUrl}
        />
      )}
    </div>
  );
};

export default CardElement;
