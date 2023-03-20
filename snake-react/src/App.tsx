import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material";
import MainLayout from "./components/MainLayout";
import { ErrorPage } from "./pages/ErrorPage";
import "./App.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { PlayPage } from "./pages/PlayPage";
import { TrainingPage } from "./pages/TraningPage";
import { TrainedModelsPage } from "./pages/TrainedModelsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "play",
        element: <PlayPage />,
      },
      {
        path: "",
        element: <PlayPage />,
      },
      {
        path: "training",
        element: <TrainingPage />,
      },
      {
        path: "trained-models",
        element: <TrainedModelsPage />,
      },
    ],
  },
]);

const theme = createTheme({
  typography: {
    button: {
      textTransform: "none",
    },
  },
  palette: {
    mode: "dark",
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  );
}

export default App;
