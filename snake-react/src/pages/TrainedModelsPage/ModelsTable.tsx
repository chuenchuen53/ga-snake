import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { deleteModelThunk, getModelDetailThunk } from "../../redux/slice/trainedModelsSlice";
import type { TrainedModel } from "snake-express/api-typing/trained-models";
import type { AppDispatch } from "../../redux/store";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    field: "createdAt",
    headerName: "created at",
    type: "dateTime",
    width: 200,
    valueFormatter: ({ value }) => new Date(value).toLocaleString(),
  },
  { field: "generation", headerName: "generation", width: 175 },
  { field: "bestSnakeLength", headerName: "best snake length", width: 175 },
  { field: "bestMoves", headerName: "best moves", width: 175 },
  {
    field: "snakeLengthMean",
    headerName: "snake length mean",
    width: 175,
    valueFormatter: ({ value }) => Math.floor(value),
  },
  {
    field: "detail",
    headerName: "detail",
    renderCell: (params: GridRenderCellParams) => (
      <IconButton color="primary" onClick={() => params.value()}>
        <FindInPageIcon />
      </IconButton>
    ),
  },
  {
    field: "delete",
    headerName: "delete",
    renderCell: (params: GridRenderCellParams) => (
      <IconButton color="primary" onClick={() => params.value()}>
        <DeleteForeverIcon />
      </IconButton>
    ),
  },
];

export const ModelsTable = () => {
  const models = useAppSelector((state) => state.trainedModels.models);
  const dispatch = useAppDispatch();

  const rows = toRows(models ?? [], dispatch);

  return (
    <DataGrid
      loading={!models}
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

function toRows(models: TrainedModel[], dispatch: AppDispatch) {
  return models.map((model) => ({
    ...model,
    createdAt: new Date(model.createdAt),
    detail: () => dispatch(getModelDetailThunk(model.id)),
    delete: () => dispatch(deleteModelThunk(model.id)),
  }));
}