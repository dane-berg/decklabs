import React from "react";
import FileUploader from "./common/FileUploader";
import { I18n } from "../injectables/i18n";

const StudioPage = () => {
  return (
    <>
      <h2>{I18n.get("tab-studio")}</h2>
      <FileUploader />
    </>
  );
};

export default StudioPage;
