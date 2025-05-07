import { Button, ButtonGroup } from "@mui/material";
import { useState } from "react";

interface Inputs {
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  icon?: React.ReactNode;
  onValueChange?: (value: number) => void | Promise<void>;
}

const NumberField = ({
  defaultValue,
  minValue,
  maxValue,
  icon,
  onValueChange,
}: Inputs) => {
  const [value, setValue] = useState<number | undefined>(defaultValue);

  return (
    <ButtonGroup>
      <Button
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
          setValue(defaultValue ?? 0);
          onValueChange?.(defaultValue ?? 0);
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
  );
};

export default NumberField;
