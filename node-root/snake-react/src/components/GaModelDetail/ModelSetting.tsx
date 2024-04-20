import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";

interface Props {
  worldWidth: number;
  worldHeight: number;
  hiddenLayersLength: number[];
  hiddenLayerActivationFunction: string;
  populationSize: number;
  populationMutationRate: number;
  geneMutationRate: number;
  mutationAmount: number;
  trialTimes: number;
  generation: number;
}

interface ParamTableProps {
  header: string;
  rows: (string | number | number[])[][];
}

const ParamTable = ({ header, rows }: ParamTableProps) => {
  return (
    <TableContainer component={Paper} sx={{ width: 350 }} elevation={12}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell align="left">{`${header} param`}</TableCell>
            <TableCell align="right">value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
              <TableCell component="th" scope="row" align="left">
                {row[0]}
              </TableCell>
              <TableCell align="right">{Array.isArray(row[1]) ? row[1].join(", ") : row[1]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const gameParamsKeys: (keyof Props)[] = ["worldWidth", "worldHeight"];
const snakeBrainParamsKeys: (keyof Props)[] = ["hiddenLayersLength", "hiddenLayerActivationFunction"];
const gaModelParamsKeys: (keyof Props)[] = ["populationSize", "populationMutationRate", "geneMutationRate", "mutationAmount", "trialTimes", "generation"];

export const ModelSetting = (props: Props) => {
  const gameParamsRows = gameParamsKeys.map((key) => [key, props[key]]);
  const snakeBrainParamsRows = snakeBrainParamsKeys.map((key) => [key, props[key]]);
  const gaModelParamsRows = gaModelParamsKeys.map((key) => [key, props[key]]);

  return (
    <Box sx={{ display: "flex", gap: 2 }}>
      <ParamTable header="game" rows={gameParamsRows} />
      <ParamTable header="snake brain" rows={snakeBrainParamsRows} />
      <ParamTable header="ga model" rows={gaModelParamsRows} />
    </Box>
  );
};
