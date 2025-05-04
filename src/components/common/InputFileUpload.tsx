import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import UploadIcon from "@mui/icons-material/Upload";
import { I18n } from "../../injectables/i18n";
import { useState } from "react";

interface Inputs {
  onFileChange?: (file: File | undefined) => void | Promise<void>;
  hideCurrentFile?: boolean;
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

// modified from https://mui.com/material-ui/react-button/#system-InputFileUpload.tsx
export default function InputFileUpload({
  onFileChange,
  hideCurrentFile,
}: Inputs) {
  const [file, setFile] = useState<File | undefined>(undefined);

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "nowrap",
        alignItems: "center",
        gap: "8px",
      }}
    >
      <Button
        component="label"
        role={undefined}
        variant="contained"
        tabIndex={-1}
        startIcon={<UploadIcon />}
        style={{ height: "36.5px" }}
      >
        {I18n.get("upload-file")}
        <VisuallyHiddenInput
          type="file"
          onChange={(event) => {
            onFileChange?.(event.target.files?.[0]);
            setFile(event.target.files?.[0]);
          }}
        />
      </Button>
      {!hideCurrentFile && file && (
        <div>
          <p>File name: {file.name}</p>
          <p>Size: {(file.size / 1024).toFixed(2)} KB</p>
          <p>Type: {file.type}</p>
        </div>
      )}
    </div>
  );
}
