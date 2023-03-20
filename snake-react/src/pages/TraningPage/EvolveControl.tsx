import React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import LoadingButton from "@mui/lab/LoadingButton";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import { FormControlLabel } from "@mui/material";
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
  const evolveTimes = useAppSelector((state) => state.training.evolveTimes);
  const backupPopulationWhenFinish = useAppSelector((state) => state.training.backupPopulationWhenFinish);
  const evolving = useAppSelector((state) => state.training.evolving);
  const backupInProgress = useAppSelector((state) => state.training.backupInProgress);
  const subscribed = useAppSelector((state) => state.training.subscribed);
  const waitingForPolling = useAppSelector((state) => state.training.waitingForPolling);
  const dispatch = useAppDispatch();

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <TextField label="times" variant="outlined" type="number" value={evolveTimes} onChange={(e) => dispatch(setEvolveTimes(e.target.value))} sx={{ width: 70 }} />
        <Button sx={{ width: 80 }} variant="contained" onClick={() => (evolving ? dispatch(stopEvolveThunk()) : dispatch(evolveThunk()))}>
          {evolving ? "stop" : "evolve"}
        </Button>
        <FormGroup>
          <FormControlLabel control={<Switch checked={backupPopulationWhenFinish} onChange={() => dispatch(toggleBackupPopulationWhenFinishThunk())} />} label="backup population when finish" />
        </FormGroup>
        <LoadingButton variant="contained" loading={backupInProgress} onClick={() => dispatch(backupCurrentPopulationThunk())}>
          backup current population
        </LoadingButton>
        <Button variant="contained" onClick={() => dispatch(getCurrentModelInfoThunk())}>
          refresh
        </Button>
        <Button variant="contained" disabled={!subscribed && waitingForPolling} onClick={() => dispatch(subscribed ? stopSubscribeInfoThunk() : startSubscribeInfoThunk())}>
          {subscribed ? "unsubscribe" : "subscribe"}
        </Button>
      </Box>
    </Box>
  );
};
