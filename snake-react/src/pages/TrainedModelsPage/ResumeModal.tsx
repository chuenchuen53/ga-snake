import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { setOpenResumeModal } from "../../redux/slice/trainedModelsSlice";
import { resumeModelThunk, setSuspendDidMountGetCurrentModelInfo } from "../../redux/slice/trainingSlice";
import type { ResumeModelPayload } from "../../redux/slice/trainedModelsSlice";

export const ResumeModal = () => {
  const openResumeModal = useAppSelector((state) => state.trainedModels.openResumeModal);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const resumeModel = (payload: ResumeModelPayload) => {
    dispatch(setOpenResumeModal(null));
    dispatch(setSuspendDidMountGetCurrentModelInfo(true));
    navigate("/training");
    dispatch(resumeModelThunk(payload.modelId, payload.generation, () => dispatch(setSuspendDidMountGetCurrentModelInfo(false))));
  };

  return (
    <Dialog onClose={() => dispatch(setOpenResumeModal(null))} open={Boolean(openResumeModal)}>
      <DialogTitle>Select Generation</DialogTitle>
      <List sx={{ pt: 0 }}>
        {(openResumeModal ?? []).map((x) => (
          <ListItem disableGutters key={x.generation}>
            <ListItemButton onClick={() => resumeModel(x)} key={x.generation}>
              <ListItemText primary={x.generation} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};
