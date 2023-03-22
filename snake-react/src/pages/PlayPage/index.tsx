import React from "react";
import Box from "@mui/material/Box";
import { SnakeGameUiWrapper } from "./SnakeGameUiWrapper";
import { WorldSizeForm } from "./WorldSizeForm";
import { GameStatsTableWrapper } from "./GameStatsTableWrapper";

export const PlayPage = () => {
  return (
    <div id="play-page">
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <SnakeGameUiWrapper />
        <Box>
          <WorldSizeForm />
          <GameStatsTableWrapper />
        </Box>
      </Box>
    </div>
  );
};
