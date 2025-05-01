import FileUploader from "./common/FileUploader";
import { I18n } from "../injectables/i18n";
import { useState } from "react";

const StudioPage = () => {
  const [template, setTemplate] = useState(null);

  // TODO: https://mui.com/material-ui/react-button/#system-InputFileUpload.tsx
  return (
    <>
      <h2>{I18n.get("tab-studio")}</h2>
      <div style={{ display: "flex" }}>
        <div>
          <FileUploader />
        </div>
        {template && (
          <img
            alt={I18n.get("card-preview-alt")}
            src={template}
          />
        )}
      </div>
    </>
  );
};

export default StudioPage;
