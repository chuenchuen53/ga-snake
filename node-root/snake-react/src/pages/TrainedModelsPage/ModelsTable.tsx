import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import IconButton from "@mui/material/IconButton";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import CachedIcon from "@mui/icons-material/Cached";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { deleteModelThunk, getModelDetailThunk, setOpenResumeModal } from "../../redux/slice/trainedModelsSlice";
import type { ResumeModelPayload } from "../../redux/slice/trainedModelsSlice";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

export const ModelsTable = () => {
  const models = useAppSelector((state) => state.trainedModels.models);
  const currentModelId = useAppSelector((state) => state.training.currentModelInfo?._id);
  const dispatch = useAppDispatch();

  const getModelDetail = (id: string) => dispatch(getModelDetailThunk(id));
  const deleteModel = (id: string) => dispatch(deleteModelThunk(id));
  const openResumeModal = (data: ResumeModelPayload[]) => dispatch(setOpenResumeModal(data));

  const rows = models
    ? models.map((model) => ({
        id: model._id,
        createdAt: new Date(model.createdAt),
        generation: model.generation,
        bestSnakeLength: model.bestSnakeLength ? Math.floor(model.bestSnakeLength) : null,
        bestMoves: model.bestMoves ? Math.floor(model.bestMoves) : null,
        snakeLengthMean: model.snakeLengthMean ? Math.floor(model.snakeLengthMean) : null,
        detail: model._id,
        delete: currentModelId === model._id ? null : model._id,
        resume: model.populationHistory.map((x) => ({ modelId: model._id, generation: x.generation })),
      }))
    : [];

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
    {
      field: "resume",
      headerName: "resume",
      renderCell: ({ value }: GridRenderCellParams) =>
        value.length ? (
          <IconButton color="primary" onClick={() => openResumeModal(value)}>
            <CachedIcon />
          </IconButton>
        ) : null,
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
        pagination: { paginationModel: { pageSize: 100 } },
        sorting: { sortModel: [{ field: "createdAt", sort: "desc" }] },
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
