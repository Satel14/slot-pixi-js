import { ConfigType } from './config';
import Reel from "./Reel";

export interface StateType {
  (allReels: Reel[], state: StateType, config?: ConfigType, ): void;
}

export type ConfigType = ConfigType;

export type GameStageType = 'playing' | 'ending' | 'end';