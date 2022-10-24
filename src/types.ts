import { ConfigType } from "./config";
import Reel from "./Reel";

export interface StateType {
    (allReels: Reel[],  state: StateType, config?: ConfigType): void;
}