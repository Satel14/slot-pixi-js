import { reelSpinSound } from './sounds';
import { StateType } from './types';
import { getSizeArray, getBox, getRandomSprite } from './utility';
import play from './play'
import * as PIXI from 'pixi.js';
import { config, ConfigType } from "./config";
import Reel from './Reel'



const imgPaths = [
    'assets\\img\\background.png',
    'assets\\img\\winning.png',
    'assets\\img\\symbols\\01.png',
    'assets\\img\\symbols\\02.png',
    'assets\\img\\symbols\\03.png',
    'assets\\img\\symbols\\04.png',
    'assets\\img\\symbols\\05.png',
    'assets\\img\\symbols\\06.png',
    'assets\\img\\symbols\\07.png',
    'assets\\img\\symbols\\08.png',
    'assets\\img\\symbols\\09.png',
    'assets\\img\\symbols\\10.png',
    'assets\\img\\scatter.png',
    'assets\\img\\btn_spin.png',
    'assets\\img\\misc.png',
];
const loader = new PIXI.Loader();
loader.add(imgPaths).load(setup)

function setup() {

    let state: StateType = play;
    const allReels: Reel[] = [];

    const app = new PIXI.Application({
        width: config.WIDTH,
        height: config.HEIGHT
    });
    document.body.appendChild(app.view);

    const backgroundTexture = loader.resources['assets\\img\\background.png'].texture;
    const backgroundContainer = new PIXI.Container();
    const columnAmount = Math.ceil(config.VIEW_WIDTH / backgroundTexture.width)
    const rowAmount = Math.ceil(config.VIEW_HEIGHT / backgroundTexture.height)

    getSizeArray(columnAmount, rowAmount).forEach((arr, xIndex) => {
        arr.forEach(yIndex => {
            const back = new PIXI.Sprite(backgroundTexture);
            back.x = xIndex * back.width;
            back.y = yIndex * back.height;
            backgroundContainer.addChild(back)
            backgroundContainer.x = 0;
            backgroundContainer.y = -50;
        })
    })
    app.stage.addChild(backgroundContainer);

    getSizeArray(config.REEL_AMOUNT, config.REEL_AMOUNT + 6).forEach((reel, reelIndex) => {
        const symbols: PIXI.Sprite[] = [];
        const rectangles: PIXI.Graphics[] = [];
        const container = new PIXI.Container();


        const reelX = config.MARGIN + reelIndex * config.REEL_WIDTH;
        const reelY = 0;
        container.position.set(reelX, reelY);
        reel.forEach(symbolIndex => {

            const box = getBox(config);
            const boxX = 0;
            const boxY = symbolIndex * config.SYMBOL_HEIGHT;
            box.position.set(boxX, boxY)

            const symbol = getRandomSprite(imgPaths, loader, config);
            const symbolX = (config.REEL_WIDTH - symbol.width) / 2;
            const symbolY = symbolIndex * config.SYMBOL_HEIGHT;
            symbol.position.set(symbolX, symbolY)

            container.addChild(symbol)
            symbols.push(symbol)
            container.addChild(box);
            rectangles.push(box)

        })
        const blur = new PIXI.filters.BlurFilter()
        blur.blurX = 0;
        blur.blurY = 0;
        container.filters = [blur]

        const spinTime = 1000 + (1 + 1 * reelIndex);
        const newReel = new Reel(container, symbols, rectangles, blur, 0, spinTime);
        allReels.push(newReel)

        app.stage.addChild(container)
    }
    )

    const viewwindow = new PIXI.Graphics()
    const x = config.MARGIN;
    viewwindow.beginFill(0x4287f5, 0.5).drawRoundedRect(x, 335, config.VIEW_WIDTH, config.VIEW_HEIGHT, 20);
    app.stage.addChild(viewwindow);

    const button = new PIXI.Sprite(loader.resources['assets\\img\\btn_spin.png'].texture);
    button.interactive = true;
    button.width = button.height = config.BTN_RADIUS;
    button.position.set(
        config.WIDTH - config.BTN_RADIUS,
        config.HEIGHT - config.BTN_RADIUS
    );
    button.cursor = "pointer"
    button.addListener('mouseover', () => (button.texture = loader.resources['assets\\img\\btn_spin.png'].texture));
    button.addListener("pointerdown", () => {
        button.texture = loader.resources['assets\\img\\btn_spin.png'].texture
        startPlay(allReels)
        allReels.forEach(reel => {
            reel.startTime = Date.now()
            reel.position = Math.ceil(Math.random() * allReels.length)
            reel.stopTime = null;
        })
    })
    app.stage.addChild(button);

    const overlay = new PIXI.Sprite(loader.resources['assets\\img\\misc.png'].texture);
    overlay.position.set(280, 315);
    overlay.width = 848;
    overlay.height = 230;
    app.stage.addChild(overlay)

    const gameLoop = () => { }

    app.ticker.add(() => {
        state(allReels, state, config)
    })
    function startPlay(allReels: Reel[]) {
        allReels.forEach(reel => {
            reelSpinSound.play();
            reel.startTime = Date.now()
            reel.position = Math.ceil(Math.random() * allReels.length)
            reel.stopTime = null;
        })
    }
}


