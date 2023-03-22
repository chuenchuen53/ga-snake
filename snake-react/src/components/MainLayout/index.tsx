import React from "react";
import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Backdrop from "@mui/material/Backdrop";
import { ReplayModal } from "../ReplayModal";
import { SnakeBrainExamModal } from "../SnakeBrainExam";
import { useAppSelector } from "../../redux/hook";
import Header from "./Header";
import { SnackbarFeedback } from "./SnackbarFeedback";

export default function MainLayout() {
  const loading = useAppSelector((state) => state.loading.isLoading);

  return (
    <div id="main-layout">
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      <Header />
      <Box sx={{ margin: 3 }}>
        <Outlet />
      </Box>
      <SnackbarFeedback />
      <ReplayModal />
      <SnakeBrainExamModal />
    </div>
  );
}
