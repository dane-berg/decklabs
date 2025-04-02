import Shelf from "./Shelf";
import { I18n } from "../injectables/i18n";

const LibraryPage = () => {
  return (
    <>
      <h2>{I18n.get("tab-library")}</h2>
      <Shelf />
    </>
  );
};

export default LibraryPage;
