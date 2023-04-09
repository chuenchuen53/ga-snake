import React, { useEffect } from "react";
import { Typography } from "@mui/material";
import { GaModelDetail } from "../../components/GaModelDetail";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { getCurrentModelInfoThunk } from "../../redux/slice/trainingSlice";

export const GaModelDetailWrapper = () => {
  const currentModelInfo = useAppSelector((state) => state.training.currentModelInfo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentModelInfoThunk(true));
  }, []);

  return <div>{currentModelInfo ? <GaModelDetail modelInfo={currentModelInfo} /> : <Typography align="center">no model</Typography>}</div>;
};
