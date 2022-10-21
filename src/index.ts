import { getSizeArray, getBox } from './utility';
import play from './play'
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
    
    state = play;

    getSizeArray(config.REEL_AMOUNT, config.REEL_AMOUNT + 2).forEach((reel, reelIndex) => {
        const container = new PIXI.Container();

        reel.forEach(symbolIndex => {
            const box = getBox(config);
            const x = config.REEL_WIDTH * reelIndex + config.MARGIN;
            const y = (symbolIndex - 1) * config.HEIGHT + config.MARGIN;
            box.position.set(x, y)
            container.addChild(box)
        })
        app.stage.addChild(container)
    })
    const pl = timer(play)
    app.ticker.add(() => {
        play(app.stage, config)
    })
}

const timer = (fn: StateType) => {
    let time = 5;
    return (stage: PIXI.Container) => {
        if (time === 0) return;
        time--;
        fn(stage)
    }
}


setup(config);