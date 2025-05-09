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
import NumberField from "./common/NumberField";

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
  const [name, setName] = useState(defaultName);
  const [template, setTemplate] = useState<TemplateValue>(defaultTemplateValue);
  const [mana, setMana] = useState<Partial<Record<ManaColorValue, number>>>({});
  const [img, setImg] = useState<File | undefined>(undefined);
  const [traits, setTraits] = useState("");
  const [effect, setEffect] = useState("");
  const [description, setDescription] = useState("");
  const [power, setPower] = useState<number | undefined>(undefined);
  const [toughness, setToughness] = useState<number | undefined>(undefined);

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
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {
              // Title control
              <TextField
                id="outlined-controlled"
                label={I18n.get("word-title")}
                value={name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setName(event.target.value);
                }}
              />
            }
            {
              // Template control
              <FormControl>
                <InputLabel id="template-select-label">
                  {I18n.get("word-template")}
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
            }
          </div>
          {
            // Mana control
            <IconPicker<ManaColorValue>
              options={Object.values(ManaColors)}
              maxValue={Configure.max_mana_value}
              onSelectionChange={(selection) => setMana(selection)}
            />
          }
          {
            // Art control
            <InputFileUpload onFileChange={setImg} />
          }
          {
            // Traits control
            <TextField
              id="outlined-controlled"
              label={I18n.get("word-traits")}
              value={traits}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setTraits(event.target.value);
              }}
              fullWidth
            />
          }
          {
            // Effect control
            <TextField
              id="outlined-controlled"
              label={I18n.get("word-effect")}
              value={effect}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setEffect(event.target.value);
              }}
              fullWidth
            />
          }
          {
            // Description control
            <TextField
              id="outlined-controlled"
              label={I18n.get("word-description")}
              value={description}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setDescription(event.target.value);
              }}
              fullWidth
            />
          }
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {
              // Power control
              <NumberField
                label={I18n.get("word-power")}
                minValue={Configure.min_pt_value}
                maxValue={Configure.max_pt_value}
                onValueChange={setPower}
              />
            }
            {
              // Toughness control
              <NumberField
                label={I18n.get("word-toughness")}
                minValue={Configure.min_pt_value}
                maxValue={Configure.max_pt_value}
                onValueChange={setToughness}
              />
            }
          </div>
        </div>
        <div style={tileStyles}>
          {
            // Card preview
            <CanvasComponent
              aspectRatio={Configure.CARD_HEIGHT / Configure.CARD_WIDTH}
              rootElement={
                img &&
                new CardCanvasElement(
                  new Card(
                    name,
                    description,
                    img,
                    template,
                    "",
                    "",
                    true,
                    mana,
                    traits,
                    effect,
                    power,
                    toughness
                  )
                )
              }
            />
          }
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
