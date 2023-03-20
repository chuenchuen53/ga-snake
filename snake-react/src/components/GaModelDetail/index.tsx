import React from "react";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import AccordionDetails from "@mui/material/AccordionDetails/AccordionDetails";
import { ModelSetting } from "./ModelSetting";
import { EvolveHistoryTable } from "./EvolveHistoryTable";
import { EvolveHistoryChart } from "./EvolveHistoryChart";
import type { GetCurrentModelInfoResponse } from "snake-express/api-typing/training";

interface Props {
  modelInfo: GetCurrentModelInfoResponse;
}

export const GaModelDetail = ({ modelInfo: m }: Props) => {
  return (
    <Box className="ga-model-detail" sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>model param</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <ModelSetting
            worldWidth={m.worldWidth}
            worldHeight={m.worldHeight}
            hiddenLayersLength={m.hiddenLayersLength}
            hiddenLayerActivationFunction={m.hiddenLayerActivationFunction}
            populationSize={m.populationSize}
            populationMutationRate={m.populationMutationRate}
            geneMutationRate={m.geneMutationRate}
            mutationAmount={m.mutationAmount}
            trialTimes={m.trialTimes}
            generation={m.generation}
          />
        </AccordionDetails>
      </Accordion>
      <EvolveHistoryTable worldWidth={m.worldWidth} worldHeight={m.worldHeight} evolveResultHistory={m.evolveResultHistory} populationHistory={m.populationHistory} />
      <Box>
        <EvolveHistoryChart evolveResultHistory={m.evolveResultHistory} />
      </Box>
    </Box>
  );
};
