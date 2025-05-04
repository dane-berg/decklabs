import { I18n } from "../injectables/i18n";
import { useState } from "react";
import InputFileUpload from "./common/InputFileUpload";
import { Card } from "../injectables/cardsservice/card";
import CanvasComponent from "./common/CanvasComponent";
import { CardCanvasElement } from "../injectables/game/cardcanvaselement";

const tileStyles = {
  backgroundColor: "lightgrey",
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 16,
};

const StudioPage = () => {
  const [card, setCard] = useState<Card | undefined>(undefined);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <h2>{I18n.get("tab-studio")}</h2>
      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          flex: "row",
          gap: "8px",
          width: "100%",
          height: "100%",
        }}
      >
        <div style={tileStyles}>
          <InputFileUpload
            onFileChange={(file) =>
              setCard(
                file ? new Card(file.name, file, "", "", true) : undefined
              )
            }
          />
        </div>
        <div style={tileStyles}>
          <CanvasComponent rootElement={card && new CardCanvasElement(card)} />
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
