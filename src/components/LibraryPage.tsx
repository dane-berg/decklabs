import { I18n } from "../injectables/i18n";
import { useEffect, useState } from "react";
import { CardsService } from "../injectables/cardsservice/cardsservice";
import { Card } from "../injectables/cardsservice/card";
import { Button } from "@mui/material";
import CanvasComponent from "./common/CanvasComponent";
import { LibraryElement } from "../injectables/game/libraryelement";

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
        console.log("library cards");
        console.log(cards);
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
        <CanvasComponent rootElement={new LibraryElement(cards)} />
      )}
      {state === State.Error && <p>{I18n.get("library-error")}</p>}
    </div>
  );
};

export default LibraryPage;
