import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { deleteModelThunk, getModelDetailThunk } from "../../redux/slice/trainedModelsSlice";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export const ModelsTable = () => {
  const models = useAppSelector((state) => state.trainedModels.models);
  const currentModelId = useAppSelector((state) => state.training.currentModelInfo?._id);
  const dispatch = useAppDispatch();

  const getModelDetail = (id: string) => dispatch(getModelDetailThunk(id));
  const deleteModel = (id: string) => dispatch(deleteModelThunk(id));

  const rows = models
    ? models.map((model) => ({
        ...model,
        createdAt: new Date(model.createdAt),
        snakeLengthMean: model.snakeLengthMean ? Math.floor(model.snakeLengthMean) : null,
        detail: model.id,
        delete: currentModelId === model.id ? null : model.id,
      }))
    : [];

  console.log(currentModelId);
  console.log(rows);

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
    { field: "snakeLengthMean", headerName: "snake length mean", width: 175 },
    {
      field: "detail",
      headerName: "detail",
      renderCell: ({ value }: GridRenderCellParams) => (
        <IconButton color="primary" onClick={() => getModelDetail(value)}>
          <FindInPageIcon />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "delete",
      renderCell: ({ value }: GridRenderCellParams) =>
        value && (
          <IconButton color="primary" onClick={() => deleteModel(value)}>
            <DeleteForeverIcon />
          </IconButton>
        ),
    },
  ];

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
