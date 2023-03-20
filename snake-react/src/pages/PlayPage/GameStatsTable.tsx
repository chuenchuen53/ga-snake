import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import React from "react";

interface Props {
  snakeLength: number;
  moves: number;
  movesForNoFood: number;
  maxMovesOfNoFood: number;
  gameOver: boolean;
}

export function GameStatsTable({ snakeLength, movesForNoFood, moves, maxMovesOfNoFood, gameOver }: Props) {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ width: 350 }} aria-label="simple table">
        <TableBody>
          <TableRow>
            <TableCell component="th" scope="row">
              score
            </TableCell>
            <TableCell align="right">{snakeLength}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              move
            </TableCell>
            <TableCell align="right">{moves}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              no food / max move
            </TableCell>
            <TableCell align="right">
              {movesForNoFood} / {maxMovesOfNoFood}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell component="th" scope="row">
              status
            </TableCell>
            <TableCell align="right">{gameOver ? "game over" : "playing"}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
