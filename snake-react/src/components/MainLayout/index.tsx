import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";
import { ReplayModal } from "../ReplayModal";
import Header from "./Header";

export default function MainLayout() {
  return (
    <div id="main-layout">
      <Header />
      <Box sx={{ margin: 3 }}>
        <Outlet />
      </Box>
      <ReplayModal />
    </div>
  );
}
