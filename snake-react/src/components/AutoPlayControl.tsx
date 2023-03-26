import React, { useEffect, useRef } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import ButtonGroup from "@mui/material/ButtonGroup";

interface AProps {
  gameOver: undefined | boolean;
  nextMove: () => void;
}

export function AutoPlayControl({ gameOver, nextMove }: AProps) {
  const timeId = useRef(0);
  const [value, setValue] = React.useState(60);
  const [autoPlaying, setAutoPlaying] = React.useState(false);

  const shortcut = [
    [5, 10, 30],
    [60, 90, 120],
    [240, 360, 480],
  ];

  const stopAutoPlay = () => {
    window.clearInterval(timeId.current);
    timeId.current = 0;
    setAutoPlaying(false);
  };

  const startAutoPlay = (providedValue?: number) => {
    if (gameOver) return;
    if (timeId.current === 0) {
      timeId.current = window.setInterval(() => {
        try {
          nextMove();
        } catch (e) {
          stopAutoPlay();
        }
      }, 1000 / (providedValue ?? value));
      setAutoPlaying(true);
    }
  };

  useEffect(() => {
    stopAutoPlay();

    return () => {
      stopAutoPlay();
    };
  }, []);

  useEffect(() => {
    if (autoPlaying) {
      stopAutoPlay();
      startAutoPlay();
    }
  }, [value]);

  return (
    <Box sx={{ textAlign: "right" }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "end" }}>
        <Button sx={{ width: 120 }} variant="contained" disabled={autoPlaying || gameOver} onClick={() => nextMove()}>
          next move
        </Button>
        <Button sx={{ width: 120 }} variant="contained" disabled={gameOver} color={autoPlaying ? "error" : "primary"} onClick={() => (autoPlaying ? stopAutoPlay() : startAutoPlay())}>
          {autoPlaying ? "stop play" : "auto play"}
        </Button>
        <TextField type="number" label="moves / sec" variant="outlined" value={value} onChange={(e) => setValue(parseInt(e.target.value) || 1)} />
        {shortcut.map((group, index) => (
          <ButtonGroup key={index} variant="outlined">
            {group.map((v) => (
              <Button key={v} sx={{ width: 60 }} onClick={() => setValue(v)}>
                {v}
              </Button>
            ))}
          </ButtonGroup>
        ))}
      </Box>
    </Box>
  );
}
