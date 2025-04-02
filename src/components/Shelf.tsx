import { useEffect, useState } from "react";
import { Card, CardsService } from "../injectables/cardsservice";
import CardElement from "./common/CardElement";

enum State {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Error = "error",
}

const Shelf = () => {
  const [state, setState] = useState<State>(State.Idle);
  const [cards, setCards] = useState<Card[]>([]);
  useEffect(() => {
    setState(State.Loading);
    CardsService.findAll()
      .then((cards) => {
        setCards(cards);
        setState(State.Success);
      })
      .catch((_err) => setState(State.Error));
  });

  return (
    <>
      {state === State.Loading && <p>loading ...</p>}
      {state === State.Success &&
        cards.map((card: Card) => (
          <CardElement
            card={card}
            key={card.id}
          />
        ))}
      {state === State.Error && (
        <p>There was an error retrieving the cards library.</p>
      )}
    </>
  );
};

export default Shelf;
