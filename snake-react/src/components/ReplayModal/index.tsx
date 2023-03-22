import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { clearReplay, nextMove } from "../../redux/slice/replaySnakeGameSlice";
import { AutoPlayControl } from "../AutoPlayControl";
import { SnakeGameUiWrapper } from "./SnakeGameUiWrapper";

let timerId = 0;

export const ReplayModal = () => {
  const openModel = useAppSelector((state) => state.replaySnakeGame.openModal);
  const nextMoveIndex = useAppSelector((state) => state.replaySnakeGame.nextMoveIndex);
  const gameOver = useAppSelector((state) => Boolean(state.replaySnakeGame.snakeGame?.gameOver));
  const dispatch = useAppDispatch();

  const [autoPlaying, setAutoPlaying] = React.useState(false);
  const [movesPerSecond, setMovesPerSecond] = React.useState(60);

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
            <Box sx={{ textAlign: "right", mb: 2 }}>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <AutoPlayControl
              value={movesPerSecond}
              setValue={setMovesPerSecond}
              autoPlaying={autoPlaying}
              gameOver={gameOver}
              nextMove={() => dispatch(nextMove())}
              autoPlay={autoPlay}
              stopAutoPlay={stopAutoPlay}
            />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
