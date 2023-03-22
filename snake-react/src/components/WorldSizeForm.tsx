import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React from "react";

interface Props {
  worldWidth: number;
  worldHeight: number;
  setWorldWidth: (width: number) => void;
  setWorldHeight: (height: number) => void;
  changeWorldSize: () => void;
}

export function WorldSizeForm({ worldWidth, worldHeight, setWorldWidth, setWorldHeight, changeWorldSize }: Props) {
  const changeWorldWidth = (e: React.ChangeEvent<HTMLInputElement>) => setWorldWidth(parseInt(e.target.value) || 0);
  const changeWorldHeight = (e: React.ChangeEvent<HTMLInputElement>) => setWorldHeight(parseInt(e.target.value) || 0);

  return (
    <div>
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <TextField required label="width" variant="outlined" type="number" value={worldWidth} onChange={changeWorldWidth} sx={{ width: 70 }} />
        <TextField required label="height" variant="outlined" type="number" value={worldHeight} onChange={changeWorldHeight} sx={{ width: 70 }} />
      </Box>
      <Button sx={{ flex: "100%" }} variant="contained" onClick={changeWorldSize}>
        New Game
      </Button>
    </div>
  );
}
