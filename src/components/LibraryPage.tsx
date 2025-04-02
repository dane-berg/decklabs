import React, { Suspense } from "react";
import { CardsService } from "../injectables/cardsservice";
import Shelf from "./Shelf";

const LibraryPage = () => {
  return (
    <>
      <h2>Library</h2>
      <Shelf />
    </>
  );
};

export default LibraryPage;
