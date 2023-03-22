import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { changeWorldSize, setWorldHeight, setWorldWidth } from "../../redux/slice/manualSnakeGameSlice";

export function WorldSizeForm() {
  const worldWidth = useAppSelector((state) => state.manualSnakeGame.worldWidth);
  const worldHeight = useAppSelector((state) => state.manualSnakeGame.worldHeight);
  const dispatch = useAppDispatch();

  const changeWidth = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(setWorldWidth(parseInt(e.target.value)));
  const changeHeight = (e: React.ChangeEvent<HTMLInputElement>) => dispatch(setWorldHeight(parseInt(e.target.value)));

  return (
    <Box sx={{ "& > :not(style)": { m: 1 } }}>
      <TextField required label="width" variant="outlined" type="number" value={worldWidth} onChange={changeWidth} sx={{ width: 100 }} />
      <TextField required label="height" variant="outlined" type="number" value={worldHeight} onChange={changeHeight} sx={{ width: 100 }} />
      <Button variant="contained" onClick={() => dispatch(changeWorldSize())} sx={{ height: "56px" }}>
        New Game
      </Button>
    </Box>
  );
}
