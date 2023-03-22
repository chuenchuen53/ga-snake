import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ButtonGroup from "@mui/material/ButtonGroup";
import React from "react";

interface AProps {
  value: number;
  setValue: (value: number) => void;
  autoPlaying: boolean;
  gameOver: undefined | boolean;
  nextMove: () => void;
  autoPlay: () => void;
  stopAutoPlay: () => void;
}

export function AutoPlayControl({ value, setValue, autoPlaying, gameOver, nextMove, autoPlay, stopAutoPlay }: AProps) {
  const group1 = [5, 10, 30];
  const group2 = [60, 120, 240];

  return (
    <Box sx={{ textAlign: "right" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "end" }}>
        <Button sx={{ width: 120 }} variant="contained" disabled={autoPlaying || gameOver} onClick={() => nextMove()}>
          next move
        </Button>
        <Button sx={{ width: 120 }} variant="contained" disabled={gameOver} color={autoPlaying ? "error" : "primary"} onClick={() => (autoPlaying ? stopAutoPlay() : autoPlay())}>
          {autoPlaying ? "stop play" : "auto play"}
        </Button>
        <TextField type="number" label="moves / sec" variant="outlined" value={value} onChange={(e) => setValue(parseInt(e.target.value) || 0)} />
        <ButtonGroup variant="outlined">
          {group1.map((v) => (
            <Button key={v} sx={{ width: 60 }} onClick={() => setValue(v)}>
              {v}
            </Button>
          ))}
        </ButtonGroup>
        <ButtonGroup variant="outlined">
          {group2.map((v) => (
            <Button key={v} sx={{ width: 60 }} onClick={() => setValue(v)}>
              {v}
            </Button>
          ))}
        </ButtonGroup>
      </Box>
    </Box>
  );
}
