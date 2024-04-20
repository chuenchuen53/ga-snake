import React from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hook";
import { changeWorldSize, setWorldHeight, setWorldWidth } from "../../redux/slice/manualSnakeGameSlice";
import { WorldSizeForm } from "../../components/WorldSizeForm";

export function WorldSizeFormWrapper() {
  const worldWidth = useAppSelector((state) => state.manualSnakeGame.worldWidth);
  const worldHeight = useAppSelector((state) => state.manualSnakeGame.worldHeight);
  const dispatch = useAppDispatch();

  return (
    <WorldSizeForm
      worldWidth={worldWidth}
      worldHeight={worldHeight}
      setWorldWidth={(v) => dispatch(setWorldWidth(v))}
      setWorldHeight={(v) => dispatch(setWorldHeight(v))}
      changeWorldSize={() => dispatch(changeWorldSize())}
    />
  );
}
