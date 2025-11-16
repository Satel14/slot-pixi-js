import { ConfigType as ConfigTypeFromConfig } from './config';
import Reel from "./Reel";

export interface StateType {
  (allReels: Reel[], state: StateType, config?: ConfigTypeFromConfig, ): void;
}

export type ConfigType = ConfigTypeFromConfig;

export type GameStageType = 'playing' | 'ending' | 'end';
