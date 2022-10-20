import * as PIXI from 'pixi.js';
import { config, ConfigType } from "./config";

interface StateType {
  (stage: PIXI.Container, config?: ConfigType): void;
}
let state: StateType;

function setup(config: ConfigType) {
  const app = new PIXI.Application({  
    width: config.WIDTH, 
    height: config.HEIGHT
  });

  document.body.appendChild(app.view);
}

setup(config);