import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { clearReplay, nextMove } from "../../redux/slice/replaySnakeGameSlice";
import { SnakeGameUiWrapper } from "./SnakeGameUiWrapper";

let timerId = 0;

export const ReplayModal = () => {
  const openModel = useAppSelector((state) => state.replaySnakeGame.openModal);
  const nextMoveIndex = useAppSelector((state) => state.replaySnakeGame.nextMoveIndex);
  const dispatch = useAppDispatch();

  const [autoPlaying, setAutoPlaying] = React.useState(false);
  const [movesPerSecond, setMovesPerSecond] = React.useState(60);

  const handleMovesPerSecondChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const int = parseInt(event.target.value);
    if (!isNaN(int) && int > 0) {
      setMovesPerSecond(int);
    }
  };

  const autoPlay = () => {
    if (nextMoveIndex === -1) {
      return;
    } else if (timerId === 0) {
      timerId = window.setInterval(() => {
        try {
          dispatch(nextMove());
        } catch (e) {
          stopAutoPlay();
        }
      }, 1000 / movesPerSecond);
      setAutoPlaying(true);
    }
  };

  const stopAutoPlay = () => {
    if (timerId !== 0) {
      window.clearInterval(timerId);
      timerId = 0;
      setAutoPlaying(false);
    }
  };

  const handleModalClose = () => {
    stopAutoPlay();
    dispatch(clearReplay());
  };

  return (
    <Dialog
      open={openModel}
      fullWidth
      maxWidth="md"
      sx={{
        "	.MuiDialog-paper": { my: 0, height: 650, maxHeight: 650 },
      }}
    >
      <DialogContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <SnakeGameUiWrapper />
          <Box sx={{ flex: "1 0 auto" }}>
            <Box sx={{ textAlign: "right" }}>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ textAlign: "right", my: 2 }}>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "end" }}>
                <Button sx={{ width: 120 }} variant="contained" disabled={autoPlaying || nextMoveIndex === -1} onClick={() => dispatch(nextMove())}>
                  next move
                </Button>
                <Button sx={{ width: 120 }} variant="contained" color={autoPlaying ? "error" : "primary"} disabled={nextMoveIndex === -1} onClick={() => (autoPlaying ? stopAutoPlay() : autoPlay())}>
                  {autoPlaying ? "stop play" : "auto play"}
                </Button>
                <TextField type="number" label="moves / sec" variant="outlined" value={movesPerSecond} onChange={handleMovesPerSecondChange} />
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
