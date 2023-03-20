import React from "react";
import { CartesianGrid, Legend, Line, LineChart, XAxis, YAxis } from "recharts";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material";
import Typography from "@mui/material/Typography";
import type { GetCurrentModelInfoResponse } from "snake-express/api-typing/training";

interface ChartProps {
  data: ReturnType<typeof toChartData>;
  title: string;
  bestDataKey: keyof ReturnType<typeof toChartData>[number];
  meanDataKey: keyof ReturnType<typeof toChartData>[number];
  logScale?: boolean;
}

export interface Props {
  evolveResultHistory: GetCurrentModelInfoResponse["evolveResultHistory"];
}

export const EvolveHistoryChart = ({ evolveResultHistory }: Props) => {
  const theme = useTheme();
  // const bestLineColor = theme.palette.primary.dark;
  const bestLineColor = theme.palette.primary.dark;
  const meanLineColor = theme.palette.secondary.dark;

  const data = toChartData(evolveResultHistory);

  const Chart = ({ data, title, bestDataKey, meanDataKey, logScale }: ChartProps) => {
    return (
      <div>
        <Typography align="center" variant="h5">
          {title}
        </Typography>
        <LineChart width={1100} height={600} data={data} margin={{ top: 24, right: 24, left: 0, bottom: 24 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="generation" />
          <YAxis scale={logScale ? "log" : "linear"} domain={["auto", "auto"]} />
          <Legend />
          <Line isAnimationActive={false} type="monotone" dot={false} dataKey={bestDataKey} stroke={bestLineColor} />
          <Line isAnimationActive={false} type="monotone" dot={false} dataKey={meanDataKey} stroke={meanLineColor} />
        </LineChart>
      </div>
    );
  };

  return (
    <Box>
      <Paper elevation={1} sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 3 }}>
        <Chart data={data} title="Snake Length" bestDataKey={"bestSnakeLength"} meanDataKey="meanSnakeLength" />
        <Chart data={data} title="Fitness" bestDataKey={"bestFitness"} meanDataKey="meanFitness" logScale />
        <Chart data={data} title="Moves" bestDataKey={"bestMoves"} meanDataKey="meanMoves" />
      </Paper>
    </Box>
  );
};

function toChartData(evolveResultHistory: GetCurrentModelInfoResponse["evolveResultHistory"]) {
  return evolveResultHistory.map((x) => {
    return {
      generation: x.generation,
      bestFitness: x.bestIndividual.fitness,
      meanFitness: x.overallStats.fitness.mean,
      bestSnakeLength: x.bestIndividual.snakeLength,
      meanSnakeLength: x.overallStats.snakeLength.mean,
      bestMoves: x.bestIndividual.moves,
      meanMoves: x.overallStats.moves.mean,
    };
  });
}
