import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import DoneIcon from "@mui/icons-material/Done";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import QuizIcon from "@mui/icons-material/Quiz";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import Button from "@mui/material/Button";
import { setNewReplay } from "../../redux/slice/replaySnakeGameSlice";
import { useAppDispatch } from "../../redux/hook";
import { setSnakeBrain } from "../../redux/slice/snakeBrainExamSlice";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import type { AppDispatch } from "../../redux/store";
import type { GetCurrentModelInfoResponse } from "snake-express/api-typing/training";

interface Props {
  worldWidth: number;
  worldHeight: number;
  populationHistory: GetCurrentModelInfoResponse["populationHistory"];
  evolveResultHistory: GetCurrentModelInfoResponse["evolveResultHistory"];
}

const columns: GridColDef[] = [
  {
    field: "generation",
    headerName: "Generation",
    width: 110,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: "flex" }}>
        <Typography sx={{ width: 50 }}>{params.value}</Typography>
        {params.row.populationFound ? <DoneIcon color="success" /> : null}
      </Box>
    ),
  },
  { field: "bestFitness", headerName: "best fitness", width: 120 },
  { field: "bestSnakeLength", headerName: "best snake length", width: 60 },
  { field: "bestMoves", headerName: "best moves", width: 70 },
  { field: "fitnessMin", headerName: "fitness min", width: 120 },
  { field: "fitnessMax", headerName: "fitness max", width: 120 },
  { field: "fitnessMean", headerName: "fitness mean", width: 120 },
  { field: "snakeLengthMin", headerName: "snake length min", width: 60 },
  { field: "snakeLengthMax", headerName: "snake length max", width: 60 },
  { field: "snakeLengthMean", headerName: "snake length mean", width: 60 },
  { field: "movesMin", headerName: "moves min", width: 70 },
  { field: "movesMax", headerName: "moves max", width: 70 },
  { field: "movesMean", headerName: "moves mean", width: 70 },
  { field: "timeSpent", headerName: "time spent in training", width: 70 },
  {
    field: "replay",
    headerName: "replay",
    width: 40,
    renderCell: (params: GridRenderCellParams) => (
      <IconButton color="primary" onClick={() => params.value()}>
        <PlayCircleOutlineIcon />
      </IconButton>
    ),
  },
  {
    field: "exam",
    headerName: "exam",
    width: 40,
    renderCell: (params: GridRenderCellParams) => (
      <IconButton color="primary" onClick={() => params.value()}>
        <QuizIcon />
      </IconButton>
    ),
  },
];

function toDataGridRows(populationHistory: Props["populationHistory"], evolveResultHistory: Props["evolveResultHistory"], dispatch: AppDispatch) {
  return evolveResultHistory.map((evolveResult, generation) => ({
    id: evolveResult._id,
    populationFound: Boolean(populationHistory.find((x) => x.generation === generation)),
    generation,
    bestFitness: Math.floor(evolveResult.bestIndividual.fitness),
    bestSnakeLength: evolveResult.bestIndividual.snakeLength,
    bestMoves: evolveResult.bestIndividual.moves,
    fitnessMin: Math.floor(evolveResult.overallStats.fitness.min),
    fitnessMax: Math.floor(evolveResult.overallStats.fitness.max),
    fitnessMean: Math.floor(evolveResult.overallStats.fitness.mean),
    snakeLengthMin: evolveResult.overallStats.snakeLength.min,
    snakeLengthMax: evolveResult.overallStats.snakeLength.max,
    snakeLengthMean: Math.floor(evolveResult.overallStats.snakeLength.mean),
    movesMin: evolveResult.overallStats.moves.min,
    movesMax: evolveResult.overallStats.moves.max,
    movesMean: Math.floor(evolveResult.overallStats.moves.mean),
    timeSpent: evolveResult.timeSpent,
    replay: () => {
      const gameRecord = evolveResult.bestIndividual.gameRecord;
      if (gameRecord) dispatch(setNewReplay(gameRecord));
    },
    exam: () => {
      const snakeBrain = evolveResult.bestIndividual.snakeBrain;
      dispatch(setSnakeBrain(snakeBrain));
    },
  }));
}

function toTabularText(rows: ReturnType<typeof toDataGridRows>) {
  const data = rows
    .map((x) => {
      const { id: _id, populationFound: _populationFound, replay: _replay, exam: _exam, ...rest } = x;
      return rest;
    })
    .sort((a, b) => b.generation - a.generation);
  const header = Object.keys(data[0]).join("\t");
  const content = data.map((x) => Object.values(x).join("\t")).join("\n");
  return header + "\n" + content;
}

export const EvolveHistoryTable = (props: Props) => {
  const dispatch = useAppDispatch();
  const rows = toDataGridRows(props.populationHistory, props.evolveResultHistory, dispatch);

  const toolbar = () => (
    <Button startIcon={<CopyAllIcon />} onClick={() => copyAll()}>
      copy
    </Button>
  );
  const copyAll = () => {
    const text = toTabularText(rows);
    navigator.clipboard.writeText(text);
  };

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      density="compact"
      columnHeaderHeight={100}
      disableRowSelectionOnClick
      slots={{ toolbar }}
      initialState={{
        pagination: { paginationModel: { pageSize: 100 } },
        sorting: { sortModel: [{ field: "generation", sort: "desc" }] },
      }}
      sx={{
        flex: "0 0 650px",
        height: 650,
        width: "100%",
        "& .MuiDataGrid-columnHeaderTitle": {
          overflow: "visible",
          lineHeight: "1.2rem",
          whiteSpace: "normal",
        },
      }}
    />
  );
};
