import { useEffect, useState } from "react";
import CardElement from "./common/CardElement";
import { I18n } from "../injectables/i18n";
import { CardsService } from "../injectables/cardsservice/cardsservice";
import { Card } from "../injectables/cardsservice/card";

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
    CardsService.getAll()
      .then((cards) => {
        setCards(cards);
        setState(State.Success);
      })
      .catch((_err) => setState(State.Error));
  });

  return (
    <>
      {state === State.Loading && <p>{I18n.get("loading-string")}</p>}
      {state === State.Success &&
        cards.map((card: Card) => (
          <CardElement
            card={card}
            key={card.id}
          />
        ))}
      {state === State.Error && <p>{I18n.get("library-error")}</p>}
    </>
  );
};

export default Shelf;
