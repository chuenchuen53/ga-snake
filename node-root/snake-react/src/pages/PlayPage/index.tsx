import React from "react";
import Box from "@mui/material/Box";
import { SnakeGameUiWrapper } from "./SnakeGameUiWrapper";
import { WorldSizeFormWrapper } from "./WorldSizeFormWrapper";
import { GameStatsTableWrapper } from "./GameStatsTableWrapper";

export const PlayPage = () => {
  return (
    <div id="play-page">
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <SnakeGameUiWrapper />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <WorldSizeFormWrapper />
          <GameStatsTableWrapper />
        </Box>
      </Box>
    </div>
  );
};
