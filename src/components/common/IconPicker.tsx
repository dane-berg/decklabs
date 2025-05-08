import { Avatar } from "@mui/material";
import { useState } from "react";
import NumberField from "./NumberField";

type Icon<T> = {
  value: T;
  name: string;
  imgSrc: string;
};

interface Inputs<T extends string | number> {
  options: Icon<T>[];
  maxValue?: number;
  onSelectionChange?: (
    selection: Partial<Record<T, number>>
  ) => void | Promise<void>;
}

const IconPicker = <T extends string | number>({
  options,
  maxValue,
  onSelectionChange,
}: Inputs<T>) => {
  const [selection, setSelection] = useState<Partial<Record<T, number>>>({});

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 8,
      }}
    >
      {options.map((icon) => (
        <NumberField
          key={icon.value}
          maxValue={maxValue}
          minValue={0}
          icon={
            <Avatar
              sx={{
                bgcolor: "darkgrey",
                // ideally this should be handled inside of NumberField.tsx, but it is difficult to style 'projected' content
                marginLeft: selection[icon.value] === undefined ? 1 : 0,
              }}
              alt={icon.name}
              src={icon.imgSrc}
            />
          }
          onValueChange={(value) => {
            const newSelection = { ...selection, [icon.value]: value };
            setSelection(newSelection);
            onSelectionChange?.(newSelection);
          }}
        />
      ))}
    </div>
  );
};

export default IconPicker;
