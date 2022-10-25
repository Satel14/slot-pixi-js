import { reelSpinSound } from './sounds';
import { StateType, GameStageType, ConfigType } from './types';
import { getSizeArray, getBox, getRandomSprite } from './utility';
import play from './play'
import * as PIXI from 'pixi.js';
import { config } from "./config";
import Reel from './Reel'

let gameStage: GameStageType = 'end';

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
    'assets\\img\\symbols\\box.png',
    'assets\\img\\symbols\\scatter.png',
    'assets\\img\\btn_spin_normal.png',
    'assets\\img\\btn_spin_disable.png',
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


    const viewwindow = new PIXI.Graphics()
    const x = config.MARGIN;
    viewwindow.beginFill(0x5872f5, 0.5).drawRoundedRect(x, 335, config.VIEW_WIDTH, config.VIEW_HEIGHT, 20);
    app.stage.addChild(viewwindow);

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
        const reelY = config.MARGIN * config.VIEW_HEIGHT - (config.SYMBOLS_AMOUNT + 6) * config.SYMBOL_HEIGHT;
        container.position.set(reelX, reelY);
        reel.forEach(symbolIndex => {

            const box = getBox(config);
            const boxX = 0;
            const boxY = symbolIndex * config.SYMBOL_HEIGHT;
            box.position.set(boxX, boxY)

            const symbol = getRandomSprite(viewwindow, imgPaths, loader, config);
            const symbolX = (config.REEL_WIDTH - symbol.width) / 2;
            const symbolY = symbolIndex * config.SYMBOL_HEIGHT;
            symbol.position.set(symbolX, symbolY)

            container.addChild(symbol)
            symbols.push(symbol)
            // container.addChild(box);
            // rectangles.push(box)

        })

        symbols.forEach((sprite, index, thisArray) => {
            if (index > symbols.length - 5) {
                const sameSpriteIndex = index - (symbols.length - 5) - 1;
                sprite.texture = symbols[sameSpriteIndex].texture;
            }
        })
        const blur = new PIXI.filters.BlurFilter()
        blur.blurX = 0;
        blur.blurY = 0;
        container.filters = [blur]

        const spinTime = config.BASE_SPIN_DURATION * (1 + 1 * reelIndex);
        const newReel = new Reel(container, symbols, rectangles, blur, 0, spinTime);
        allReels.push(newReel)

        app.stage.addChild(container)
    }
    )



    const button = new PIXI.Sprite(loader.resources['assets\\img\\btn_spin_normal.png'].texture);
    button.interactive = true;
    button.buttonMode = true;
    button.width = button.height = config.BTN_RADIUS;
    button.position.set(
        config.WIDTH - config.BTN_RADIUS,
        config.HEIGHT - config.BTN_RADIUS
    );
    button.cursor = "pointer"
    button.addListener(
        'mouseout',
        () => (button.texture = loader.resources['assets\\img\\btn_spin_normal.png'].texture)
      );
      button.addListener('pointerdown', () => (button.texture = loader.resources['assets\\img\\btn_spin_disable.png'].texture));
    button.addListener("pointerdown", () => {
        button.texture = loader.resources['assets\\img\\btn_spin_normal.png'].texture
        startPlay(allReels)
        allReels.forEach(reel => {
            reel.startTime = Date.now()
            reel.position = Math.ceil(Math.random() * allReels.length)
            reel.stopTime = null;
        })
    })
    app.stage.addChild(button);

    const overlay = new PIXI.Sprite(loader.resources['assets\\img\\misc.png'].texture);
    overlay.position.set(280, 300);
    overlay.width = 848;
    overlay.height = 370;
    app.stage.addChild(overlay)

    const gameLoop = () => {}

    app.ticker.add(() => {
        switch (gameStage) {
            case 'playing':
                play(allReels, state, config);
                button.interactive = false;
                button.buttonMode = false;
                button.texture = loader.resources['assets\\img\\btn_spin_disable.png'].texture;
                const isEnd = allReels.every(reel => reel.isStopped);

                if (isEnd) {
                    gameStage = 'ending';
                }
                break;
            case "ending":
                reelSpinSound.stop();
                button.interactive = true;
                button.buttonMode = true;
                button.texture = loader.resources['assets\\img\\btn_spin_normal.png'].texture;
                gameStage = 'end'
                break;
            case 'end':
                break;
        }
    })
    function startPlay(allReels: Reel[]) {
        allReels.forEach(reel => {
            reelSpinSound.play();
            reel.startTime = Date.now()
            reel.position = Math.ceil(Math.random() * allReels.length)
            reel.stopTime = null;
            reel.isStopped = false;
            gameStage = 'playing';
        })
    }
}


