import React from "react";
import Accordion from "@mui/material/Accordion/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails/AccordionDetails";
import Typography from "@mui/material/Typography";
import AccordionSummary from "@mui/material/AccordionSummary/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Box from "@mui/material/Box";
import { GaModelSetting } from "./GaModelSetting";
import { EvolveControl } from "./EvolveControl";
import "./index.scss";
import { GaModelDetailWrapper } from "./GaModelDetailWrapper";

export const TrainingPage = () => {
  return (
    <div id="training-page">
      <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>model setting</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <GaModelSetting />
          </AccordionDetails>
        </Accordion>
        <EvolveControl />
        <GaModelDetailWrapper />
      </Box>
    </div>
  );
};
