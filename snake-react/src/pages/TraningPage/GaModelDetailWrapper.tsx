import React, { useEffect } from "react";
import { GaModelDetail } from "../../components/GaModelDetail";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { getCurrentModelInfoThunk } from "../../redux/slice/trainingSlice";

export const GaModelDetailWrapper = () => {
  const currentModelInfo = useAppSelector((state) => state.training.currentModelInfo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getCurrentModelInfoThunk());
  }, []);

  return <div>{currentModelInfo && <GaModelDetail modelInfo={currentModelInfo} />}</div>;
};
