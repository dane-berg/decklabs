import { I18n } from "../injectables/i18n";
import { useEffect, useState } from "react";
import CardComponent from "./common/CardComponent";
import { CardsService } from "../injectables/cardsservice/cardsservice";
import { Card } from "../injectables/cardsservice/card";
import { Button } from "@mui/material";
import { Configure } from "../injectables/configure";

enum State {
  Idle = "idle",
  Loading = "loading",
  Success = "success",
  Error = "error",
}

const LibraryPage = () => {
  const [state, setState] = useState<State>(State.Idle);
  const [cards, setCards] = useState<Card[]>([]);

  function refresh() {
    setState(State.Loading);
    CardsService.getAll()
      .then((cards) => {
        setCards(cards);
        setState(State.Success);
      })
      .catch((_err) => setState(State.Error));
  }

  useEffect(() => refresh(), []);

  // TODO: card filtering
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h2>{I18n.get("tab-library")}</h2>
        <Button
          variant="contained"
          color="secondary"
          onClick={refresh}
          loading={state === State.Loading}
        >
          {I18n.get("word-refresh")}
        </Button>
        <p>{state}</p>
      </div>
      {state === State.Loading && cards.length === 0 && (
        <p>{I18n.get("loading-string")}</p>
      )}
      {(state === State.Success ||
        (state === State.Loading && cards.length > 0)) && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            gap: "1rem",
            height: "100%",
            backgroundColor: "lightgrey",
          }}
        >
          {cards.map((card: Card) => (
            <CardComponent
              style={{
                width: Configure.CARD_WIDTH,
                height: Configure.CARD_HEIGHT,
              }}
              card={card}
              key={card.id}
            />
          ))}
        </div>
      )}
      {state === State.Error && <p>{I18n.get("library-error")}</p>}
    </div>
  );
};

export default LibraryPage;
