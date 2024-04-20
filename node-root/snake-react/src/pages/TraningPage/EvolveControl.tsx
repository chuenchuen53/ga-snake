import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  backupCurrentPopulationThunk,
  evolveThunk,
  getCurrentModelInfoThunk,
  setEvolveTimes,
  startSubscribeInfoThunk,
  stopEvolveThunk,
  stopSubscribeInfoThunk,
  toggleBackupPopulationWhenFinishThunk,
} from "../../redux/slice/trainingSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hook";

export const EvolveControl = () => {
  const haveModel = useAppSelector((state) => Boolean(state.training.currentModelInfo));
  const evolveTimes = useAppSelector((state) => state.training.evolveTimes);
  const backupPopulationWhenFinish = useAppSelector((state) => state.training.backupPopulationWhenFinish);
  const evolving = useAppSelector((state) => state.training.evolving);
  const waitingLastEvolveAfterStop = useAppSelector((state) => state.training.waitingLastEvolveAfterStop);
  const backupInProgress = useAppSelector((state) => state.training.backupInProgress);
  const subscribed = useAppSelector((state) => state.training.subscribed);
  const waitingForPolling = useAppSelector((state) => state.training.waitingForPolling);
  const isInitialGeneration = useAppSelector((state) => (state.training.currentModelInfo?.generation ?? -1) === -1);
  const dispatch = useAppDispatch();

  const RefreshButton = () => (
    <Button sx={{ ml: "auto" }} variant="outlined" startIcon={<RefreshIcon />} onClick={() => dispatch(getCurrentModelInfoThunk())}>
      refresh
    </Button>
  );

  return haveModel ? (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      <TextField required label="times" variant="outlined" type="number" value={evolveTimes} onChange={(e) => dispatch(setEvolveTimes(e.target.value))} sx={{ width: 120 }} />
      <LoadingButton
        sx={{ width: 80 }}
        variant="contained"
        loading={waitingLastEvolveAfterStop}
        disabled={backupInProgress}
        onClick={() => (evolving ? dispatch(stopEvolveThunk()) : dispatch(evolveThunk()))}
      >
        {evolving ? "stop" : "evolve"}
      </LoadingButton>
      <LoadingButton variant="contained" disabled={isInitialGeneration || evolving} loading={backupInProgress} onClick={() => dispatch(backupCurrentPopulationThunk())}>
        backup current population
      </LoadingButton>
      <Button variant="contained" disabled={!subscribed && waitingForPolling} onClick={() => dispatch(subscribed ? stopSubscribeInfoThunk() : startSubscribeInfoThunk())}>
        {subscribed ? "unsubscribe" : "subscribe"}
      </Button>
      <FormGroup>
        <FormControlLabel control={<Switch checked={backupPopulationWhenFinish} onChange={() => dispatch(toggleBackupPopulationWhenFinishThunk())} />} label="backup population when finish" />
      </FormGroup>
      <RefreshButton />
    </Box>
  ) : (
    <RefreshButton />
  );
};
