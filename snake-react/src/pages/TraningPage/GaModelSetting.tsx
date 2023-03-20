import React from "react";
import Box from "@mui/material/Box";
import ReactJson from "react-json-view";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { ActivationFunction } from "snake-ai/CalcUtils";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { changeSetting, gaConfigKeys, gaModelSettingKeys, initModelThunk, removeCurrentModelThunk } from "../../redux/slice/trainingSlice";
import type { GaConfigKey, GaModelSettingKey } from "../../redux/slice/trainingSlice";
import type { InteractionProps } from "react-json-view";

export const GaModelSetting = () => {
  const setting = useAppSelector((state) => state.training.gaModelSetting);
  const dispatch = useAppDispatch();

  const handleOnChange = <T extends keyof typeof setting>(key: T, value: (typeof setting)[T]) => {
    dispatch(changeSetting({ key, value }));
  };

  const handleGaConfigOnChange = (value: number, key: string) => {
    const newGaConfig = {
      ...setting.gaConfig,
      [key]: value,
    };
    handleOnChange("gaConfig", newGaConfig);
  };

  const onEdit = (p: InteractionProps) => {
    if (p.name === "hiddenLayerActivationFunction") return false;
    if (typeof p.new_value !== "number") return false;

    if (gaModelSettingKeys.includes(p.name as GaModelSettingKey)) {
      handleOnChange(p.name as (typeof gaModelSettingKeys)[number], p.new_value);
    } else if (gaConfigKeys.includes(p.name as GaConfigKey)) {
      handleGaConfigOnChange(p.new_value, p.name as (typeof gaConfigKeys)[number]);
    } else if (p.namespace[0] === "snakeBrainConfig" && p.namespace[1] === "hiddenLayersLength") {
      const index = parseInt(p.name ?? "");
      if (isNaN(index)) return false;
      const newHiddenLayersLength = [...setting.snakeBrainConfig.hiddenLayersLength];
      newHiddenLayersLength[index] = p.new_value;
      handleHiddenLayersLengthOnChange(newHiddenLayersLength);
    }

    return false;
  };

  const handleHiddenLayersLengthOnChange = (value: number[]) => {
    const newSnakeBrainConfig = {
      ...setting.snakeBrainConfig,
      hiddenLayersLength: value,
    };
    handleOnChange("snakeBrainConfig", newSnakeBrainConfig);
  };

  const addLayer = () => handleHiddenLayersLengthOnChange([...setting.snakeBrainConfig.hiddenLayersLength, 1]);
  const removeLayer = () => handleHiddenLayersLengthOnChange(setting.snakeBrainConfig.hiddenLayersLength.slice(0, setting.snakeBrainConfig.hiddenLayersLength.length - 1));

  const handleHiddenLayerActivationFunctionOnChange = (value: ActivationFunction) => {
    const newSnakeBrainConfig = {
      ...setting.snakeBrainConfig,
      hiddenLayerActivationFunction: value,
    };
    handleOnChange("snakeBrainConfig", newSnakeBrainConfig);
  };

  return (
    <Box sx={{ display: "flex", gap: 4 }}>
      <Box sx={{ bgcolor: "rgb(39, 40, 34)", width: 550 }}>
        <ReactJson src={setting} name="options" theme="monokai" enableClipboard={false} displayObjectSize={false} validationMessage="" onEdit={onEdit} />
      </Box>
      <Box sx={{ "& > :not(style)": { m: 1 } }}>
        <Button startIcon={<AddCircleOutlineIcon />} variant="outlined" color="secondary" onClick={addLayer}>
          layer
        </Button>
        <Button startIcon={<RemoveCircleOutlineIcon />} variant="outlined" color="secondary" onClick={removeLayer}>
          layer
        </Button>
        <br />
        <Select value={setting.snakeBrainConfig.hiddenLayerActivationFunction} onChange={(e) => handleHiddenLayerActivationFunctionOnChange(e.target.value as ActivationFunction)}>
          <MenuItem value={ActivationFunction.LINEAR}>linear</MenuItem>
          <MenuItem value={ActivationFunction.RELU}>relu</MenuItem>
          <MenuItem value={ActivationFunction.TANH}>tanh</MenuItem>
        </Select>
        <br />
        <Button variant="contained" onClick={() => dispatch(initModelThunk())}>
          new model
        </Button>
        <Button variant="outlined" color="error" onClick={() => dispatch(removeCurrentModelThunk())}>
          delete model
        </Button>
      </Box>
    </Box>
  );
};
