import { I18n } from "../injectables/i18n";
import { useState } from "react";
import InputFileUpload from "./common/InputFileUpload";
import { Card } from "../injectables/cardsservice/card";
import CanvasComponent from "./common/CanvasComponent";
import { CardCanvasElement } from "../injectables/game/cardcanvaselement";
import { Configure } from "../injectables/configure";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import {
  defaultTemplateValue,
  Template,
  Templates,
  TemplateValue,
} from "../injectables/cardsservice/template";
import {
  ManaColors,
  ManaColorValue,
} from "../injectables/cardsservice/manacolor";
import IconPicker from "./common/IconPicker";

const tileStyles = {
  backgroundColor: "lightgrey",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: 16,
  padding: 16,
  gap: 8,
};

const StudioPage = () => {
  const defaultName = "Untitled Card";
  const [mana, setMana] = useState<Partial<Record<ManaColorValue, number>>>({});
  const [name, setName] = useState(defaultName);
  const [template, setTemplate] = useState<TemplateValue>(defaultTemplateValue);
  const [img, setImg] = useState<File | undefined>(undefined);

  // TODO: re-add the ability to publish cards
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
          <IconPicker<ManaColorValue>
            options={Object.values(ManaColors)}
            maxValue={Configure.max_mana_value}
            onSelectionChange={(selection) => setMana(selection)}
          />
          <TextField
            id="outlined-controlled"
            label="Controlled"
            value={name}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
          />
          <FormControl>
            <InputLabel id="template-select-label">
              {I18n.get("template")}
            </InputLabel>
            <Select
              labelId="template-select-label"
              id="template-select"
              value={template}
              label={I18n.get("template")}
              onChange={(event: SelectChangeEvent) =>
                setTemplate(event.target.value as TemplateValue)
              }
            >
              {(Object.values(Templates) as Template[]).map((template) => (
                <MenuItem
                  key={template.value}
                  value={template.value}
                >
                  {template.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <InputFileUpload onFileChange={setImg} />
        </div>
        <div style={tileStyles}>
          <CanvasComponent
            aspectRatio={Configure.CARD_HEIGHT / Configure.CARD_WIDTH}
            rootElement={
              img &&
              new CardCanvasElement(
                new Card(name, img, "", "", true, template, mana)
              )
            }
          />
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
