import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { getAllTrainedModelsThunk, setOpenedDetail } from "../../redux/slice/trainedModelsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { GaModelDetail } from "../../components/GaModelDetail";
import { ModelsTable } from "./ModelsTable";

export const TrainedModelsPage = () => {
  const dispatch = useAppDispatch();
  const openedDetail = useAppSelector((state) => state.trainedModels.openedDetail);
  const loading = useAppSelector((state) => state.loading.isLoading);

  useEffect(() => {
    dispatch(getAllTrainedModelsThunk());
  }, []);

  return (
    <div id="trained-model-page">
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Breadcrumbs sx={{ my: 3 }}>
        <Typography color="text.primary" sx={{ cursor: "pointer" }} onClick={() => dispatch(setOpenedDetail(null))}>
          Trained Models
        </Typography>
        {openedDetail && <Typography color="text.primary">Detail</Typography>}
      </Breadcrumbs>
      {openedDetail ? <GaModelDetail modelInfo={openedDetail}></GaModelDetail> : <ModelsTable />}
    </div>
  );
};
