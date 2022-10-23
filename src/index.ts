import { StateType } from './types';
import { getSizeArray, getBox } from './utility';
import play from './play'
import * as PIXI from 'pixi.js';
import { config, ConfigType } from "./config";
import Reel from './Reel'

function setup(config: ConfigType) {

    let state: StateType = play;
    const allReels: Reel[] = [];

    const app = new PIXI.Application({
        width: config.WIDTH,
        height: config.HEIGHT
    });
    document.body.appendChild(app.view);



    getSizeArray(config.REEL_AMOUNT, config.REEL_AMOUNT + 6).forEach((reel, reelIndex) => {
        const container = new PIXI.Container();
        const symbols: PIXI.Graphics[] = [];

        reel.forEach(symbolIndex => {
            const box = getBox(config);
            const x = 0;
            const y = symbolIndex * config.HEIGHT;
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

        const spinTime = 1000 + 1 * reelIndex;
        const newReel = new Reel(container, symbols, blur, 0, spinTime);
        allReels.push(newReel)

        app.stage.addChild(container)
    })

    const viewwindow = new PIXI.Graphics()
    const x = config.MARGIN;
    const y = config.MARGIN;
    viewwindow.lineStyle(4, 0x2344f2, 1).drawRoundedRect(x, y, config.VIEW_WIDTH, config.VIEW_HEIGHT, 20);
    app.stage.addChild(viewwindow);

    const playButton = new PIXI.Graphics()
    const radius = 50;
    const btnX = config.WIDTH - radius * 2;
    const btnY = config.HEIGHT - radius * 2;
    playButton.beginFill(0x1352ff).drawCircle(btnX, btnY, radius).endFill()
    playButton.interactive = true;
    playButton.buttonMode = true;
    playButton.cursor = "pointer"
    playButton.addListener('pointerdown', () => {
        allReels.forEach(reel => {
            reel.startTime = Date.now();
            reel.position = Math.ceil(Math.random() * allReels.length)
            reel.startTime = null;
        })
    })
    app.stage.addChild(playButton);
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