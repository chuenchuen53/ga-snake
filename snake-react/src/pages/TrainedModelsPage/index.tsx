import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import { getAllTrainedModelsThunk, setOpenedDetail } from "../../redux/slice/trainedModelsSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { GaModelDetail } from "../../components/GaModelDetail";
import { ModelsTable } from "./ModelsTable";

export const TrainedModelsPage = () => {
  const dispatch = useAppDispatch();
  const openedDetail = useAppSelector((state) => state.trainedModels.openedDetail);

  useEffect(() => {
    dispatch(getAllTrainedModelsThunk());
  }, []);

  return (
    <div>
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
