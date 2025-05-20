import { I18n } from "../injectables/i18n";
import { useEffect, useState } from "react";
import InputFileUpload from "./common/InputFileUpload";
import { Card } from "../injectables/cardsservice/card";
import CanvasComponent from "./common/CanvasComponent";
import { CardElement } from "../injectables/game/cardelement";
import { Configure } from "../injectables/configure";
import {
  Button,
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
import { CardsService } from "../injectables/cardsservice/cardsservice";
import CardComponent from "./common/CardComponent";

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
  const [templateValue, setTemplateValue] =
    useState<TemplateValue>(defaultTemplateValue);
  const [mana, setMana] = useState<Partial<Record<ManaColorValue, number>>>({});
  const [img, setImg] = useState<File | undefined>(undefined);
  const [traits, setTraits] = useState("");
  const [effect, setEffect] = useState("");
  const [description, setDescription] = useState("");
  const [power, setPower] = useState<number | undefined>(undefined);
  const [toughness, setToughness] = useState<number | undefined>(undefined);

  const [card, setCard] = useState<Card>(() =>
    CardsService.createCard({
      name: name,
      templateValue: templateValue,
      mana: mana,
      imgSrc: img,
      traits: traits,
      effect: effect,
      description: description,
      power: power,
      toughness: toughness,
    })
  );

  useEffect(() => {
    CardsService.updateCard(card.id, {
      name: name,
      templateValue: templateValue,
      mana: mana,
      imgSrc: img,
      traits: traits,
      effect: effect,
      description: description,
      power: power,
      toughness: toughness,
    });
  }, [
    name,
    templateValue,
    mana,
    img,
    traits,
    effect,
    description,
    power,
    toughness,
  ]);

  function canPublish() {
    // TODO: ensure card color makes sense w/ mana colors
    return name !== defaultName && !!img;
  }

  function publish() {
    CardsService.publishCard(card);
  }

  // TODO: allow editing unpublished cards. When the current card is changed, update the other state via useEffect
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <h2>{I18n.get("tab-studio")}</h2>
        <Button
          variant="contained"
          color="secondary"
          onClick={publish}
          disabled={!canPublish()}
        >
          {I18n.get("word-publish")}
        </Button>
      </div>
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
                  value={templateValue}
                  label={I18n.get("template")}
                  onChange={(event: SelectChangeEvent) =>
                    setTemplateValue(event.target.value as TemplateValue)
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
            <CardComponent card={card} />
          }
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
