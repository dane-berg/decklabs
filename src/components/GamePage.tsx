import React from "react";
import { Game } from "../injectables/game";
import { Box } from "@mui/material";

interface Inputs {
  game: Game;
}

const GamePage = ({ game }: Inputs) => {
  return (
    <Box
      component="div"
      sx={{ height: "100%" }}
    >
      <img
        style={{ height: "200px" }}
        src="../../../public/parchment.jpg"
      ></img>
      <canvas style={{ width: "100%", height: "100%" }}></canvas>
    </Box>
  );
};

export default GamePage;
