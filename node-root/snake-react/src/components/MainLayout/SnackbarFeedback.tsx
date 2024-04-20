import React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { closeSnackBar } from "../../redux/slice/loadingSlice";
import type { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export function SnackbarFeedback() {
  const open = useAppSelector((state) => state.loading.snackBar.open);
  const display = useAppSelector((state) => state.loading.snackBar.display);

  const dispatch = useAppDispatch();
  const onClose = () => dispatch(closeSnackBar());

  return (
    <Snackbar open={open} autoHideDuration={5000} onClose={onClose}>
      {open && display ? (
        <Alert onClose={onClose} severity={display.severity} sx={{ width: "100%" }}>
          {display.message}
        </Alert>
      ) : undefined}
    </Snackbar>
  );
}
