import { Button, ButtonGroup, InputLabel } from "@mui/material";
import { useState } from "react";

interface Inputs {
  label?: string;
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  icon?: React.ReactNode;
  onValueChange?: (value: number | undefined) => void | Promise<void>;
}

const NumberField = ({
  label,
  defaultValue,
  minValue,
  maxValue,
  icon,
  onValueChange,
}: Inputs) => {
  const labelId = label
    ? `${label.replace(/\s/g, "").toLowerCase()}-numberfield-label`
    : "numberfield-label";
  const [value, setValue] = useState<number | undefined>(defaultValue);

  return (
    <div>
      {label && <InputLabel id={labelId}>{label}</InputLabel>}
      <ButtonGroup>
        <Button
          labelId={labelId}
          onClick={() => {
            let newValue = (value ?? 0) + 1;
            if (!(maxValue !== undefined && newValue > maxValue)) {
              setValue(newValue);
              onValueChange?.(newValue);
            }
          }}
        >
          +
        </Button>
        <Button
          startIcon={icon}
          onClick={() => {
            setValue(defaultValue);
            onValueChange?.(defaultValue);
          }}
        >
          {value === undefined ? "" : `${value}`}
        </Button>
        <Button
          onClick={() => {
            let newValue = (value ?? 0) - 1;
            if (!(minValue !== undefined && newValue < minValue)) {
              setValue(newValue);
              onValueChange?.(newValue);
            }
          }}
        >
          -
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default NumberField;
