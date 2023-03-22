import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { endExam, nextMove, setWorldHeight, setWorldWidth, startNewGame } from "../../redux/slice/snakeBrainExamSlice";
import { AutoPlayControl } from "../AutoPlayControl";
import { WorldSizeForm } from "../WorldSizeForm";
import { SnakeGameUiWrapper } from "./SnakeGameUiWrapper";
import { GameStatsTableWrapper } from "./GameStatsTableWrapper";

let timerId = 0;

export const SnakeBrainExamModal = () => {
  const openModel = useAppSelector((state) => state.snakeBrainExam.openModal);
  const gameOver = useAppSelector((state) => state.snakeBrainExam.snakeGame?.gameOver);
  const worldWidth = useAppSelector((state) => state.snakeBrainExam.worldWidth);
  const worldHeight = useAppSelector((state) => state.snakeBrainExam.worldHeight);
  const haveSnakeGame = useAppSelector((state) => state.snakeBrainExam.snakeGame !== null);
  const dispatch = useAppDispatch();

  const [autoPlaying, setAutoPlaying] = React.useState(false);
  const [movesPerSecond, setMovesPerSecond] = React.useState(60);

  const autoPlay = () => {
    if (timerId === 0) {
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
    dispatch(endExam());
  };

  return (
    <Dialog
      open={openModel}
      fullWidth
      maxWidth="lg"
      sx={{
        "	.MuiDialog-paper": { my: 0, height: 650, maxHeight: 650 },
      }}
    >
      <DialogContent>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <SnakeGameUiWrapper />
          <Box sx={{ flex: "1 0 auto", ml: 4 }}>
            <Box sx={{ textAlign: "right", mb: 2 }}>
              <IconButton onClick={handleModalClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ width: 350, mb: 4 }}>{haveSnakeGame && <GameStatsTableWrapper />}</Box>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <WorldSizeForm
                worldWidth={worldWidth}
                worldHeight={worldHeight}
                setWorldWidth={(v) => dispatch(setWorldWidth(v))}
                setWorldHeight={(v) => dispatch(setWorldHeight(v))}
                changeWorldSize={() => dispatch(startNewGame())}
              />
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
        </Box>
      </DialogContent>
    </Dialog>
  );
};
