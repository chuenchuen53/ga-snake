import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import DoneIcon from "@mui/icons-material/Done";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { setNewReplay } from "../../redux/slice/replaySnakeGameSlice";
import { useAppDispatch } from "../../redux/hook";
import type { AppDispatch } from "../../redux/store";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
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
    width: 90,
    renderCell: (params: GridRenderCellParams) => (
      <Box sx={{ display: "flex" }}>
        <Typography sx={{ width: 50 }}>{params.value}</Typography>
        {params.row.populationFound ? <DoneIcon color="success" /> : null}
      </Box>
    ),
  },
  { field: "bestFitness", headerName: "best fitness", width: 120, valueFormatter: ({ value }) => Math.floor(value) },
  { field: "bestSnakeLength", headerName: "best snake length", width: 60 },
  { field: "bestMoves", headerName: "best moves", width: 70 },
  { field: "fitnessMin", headerName: "fitness min", width: 120, valueFormatter: ({ value }) => Math.floor(value) },
  { field: "fitnessMax", headerName: "fitness max", width: 120, valueFormatter: ({ value }) => Math.floor(value) },
  { field: "fitnessMean", headerName: "fitness mean", width: 120, valueFormatter: ({ value }) => Math.floor(value) },
  { field: "snakeLengthMin", headerName: "snake length min", width: 60 },
  { field: "snakeLengthMax", headerName: "snake length max", width: 60 },
  {
    field: "snakeLengthMean",
    headerName: "snake length mean",
    width: 60,
    valueFormatter: ({ value }) => Math.floor(value),
  },
  { field: "movesMin", headerName: "moves min", width: 70 },
  { field: "movesMax", headerName: "moves max", width: 70 },
  { field: "movesMean", headerName: "moves mean", width: 70, valueFormatter: ({ value }) => Math.floor(value) },
  {
    field: "timeSpent",
    headerName: "time spent in training",
    width: 70,
    valueFormatter: ({ value }) => value.toFixed(3),
  },
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
];

function toDataGridRows(populationHistory: Props["populationHistory"], evolveResultHistory: Props["evolveResultHistory"], worldWidth: number, worldHeight: number, dispatch: AppDispatch) {
  return evolveResultHistory.map((evolveResult, generation) => ({
    id: evolveResult._id,
    populationFound: Boolean(populationHistory.find((x) => x.generation === generation)),
    generation,
    bestFitness: evolveResult.bestIndividual.fitness,
    bestSnakeLength: evolveResult.bestIndividual.snakeLength,
    bestMoves: evolveResult.bestIndividual.moves,
    fitnessMin: evolveResult.overallStats.fitness.min,
    fitnessMax: evolveResult.overallStats.fitness.max,
    fitnessMean: evolveResult.overallStats.fitness.mean,
    snakeLengthMin: evolveResult.overallStats.snakeLength.min,
    snakeLengthMax: evolveResult.overallStats.snakeLength.max,
    snakeLengthMean: evolveResult.overallStats.snakeLength.mean,
    movesMin: evolveResult.overallStats.moves.min,
    movesMax: evolveResult.overallStats.moves.max,
    movesMean: evolveResult.overallStats.moves.mean,
    timeSpent: evolveResult.timeSpent,
    replay: () => {
      const gameRecord = evolveResult.bestIndividual.gameRecord;
      if (gameRecord) {
        dispatch(
          setNewReplay({
            worldWidth,
            worldHeight,
            gameRecord,
          })
        );
      }
    },
  }));
}

export const EvolveHistory = (props: Props) => {
  const dispatch = useAppDispatch();
  const rows = toDataGridRows(props.populationHistory, props.evolveResultHistory, props.worldWidth, props.worldHeight, dispatch);

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      density="compact"
      columnHeaderHeight={100}
      disableRowSelectionOnClick
      initialState={{
        pagination: {
          paginationModel: {
            pageSize: 100,
          },
        },
        sorting: {
          sortModel: [{ field: "generation", sort: "desc" }],
        },
      }}
      sx={{
        flex: "0 0 650px",
        height: 650,
        width: "100%",
        "& .MuiDataGrid-columnHeaderTitle": {
          overflow: "visible",
          lineHeight: "1.43rem",
          whiteSpace: "normal",
        },
      }}
    />
  );
};
