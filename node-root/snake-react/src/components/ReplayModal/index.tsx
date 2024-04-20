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

export const ReplayModal = () => {
  const openModel = useAppSelector((state) => state.replaySnakeGame.openModal);
  const gameOver = useAppSelector((state) => Boolean(state.replaySnakeGame.snakeGame?.gameOver));
  const dispatch = useAppDispatch();

  const handleModalClose = () => {
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
            <AutoPlayControl gameOver={gameOver} nextMove={() => dispatch(nextMove())} />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
