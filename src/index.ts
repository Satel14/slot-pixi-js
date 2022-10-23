import { StateType } from './types';
import { getSizeArray, getBox } from './utility';
import play from './play'
import * as PIXI from 'pixi.js';
import { config, ConfigType } from "./config";
import Reel from './Reel'

function setup(config: ConfigType) {
    const app = new PIXI.Application({
        width: config.WIDTH,
        height: config.HEIGHT
    });
    document.body.appendChild(app.view);

    let state: StateType = play;
    const allReels: Reel[] = [];

    getSizeArray(config.REEL_AMOUNT, config.REEL_AMOUNT + 2).forEach((reel, reelIndex) => {
        const container = new PIXI.Container();
        const symbols: PIXI.Graphics[] = [];

        reel.forEach(symbolIndex => {
            const box = getBox(config);
            const x = config.REEL_WIDTH * reelIndex + config.MARGIN;
            const y = (symbolIndex - 1) * config.HEIGHT + config.MARGIN;
            box.position.set(x, y)
            container.addChild(box)

            app.stage.addChild(container)
            symbols.push(box)
        })
        const blur = new PIXI.filters.BlurFilter()
        console.log(blur);
        blur.blurX = 0;
        blur.blurY = 0;
        container.filters = [blur]

        const spinTime = 1 + 1 * reelIndex;
        const newReel = new Reel(container, symbols, blur, new Date(), spinTime);
        allReels.push(newReel)

        app.stage.addChild(container)
    })

    const viewwindow = new PIXI.Graphics()
    const x = config.MARGIN;
    const y = config.MARGIN;
    viewwindow.lineStyle(4, 0x2344f2, 1).drawRoundedRect(x, y, config.VIEW_WIDTH, config.VIEW_HEIGHT, 40);
    app.stage.addChild(viewwindow);


    // const pl = timer(play)
    app.ticker.add(() => {
        play(allReels, config)
    })
}

// const timer = (fn: StateType) => {
//     let time = 5;
//     return (stage: PIXI.Container) => {
//         if (time === 0) return;
//         time--;
//         fn(stage)
//     }
// }


setup(config);