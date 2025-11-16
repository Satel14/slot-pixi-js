import { reelSpinSound, SoundManager } from './sounds';
import { StateType, GameStageType, ConfigType } from './types';
import { getSizeArray, getRandomSprite } from './utility';
import play from './play'
import * as PIXI from 'pixi.js';
import { config } from "./config";
import Reel from './Reel'
import WinLineManager from './WinLineManager';
import EffectsManager from './EffectsManager';
import FPSCounter from './FPSCounter';

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
    const state: StateType = play;
    const allReels: Reel[] = [];

    const app = new PIXI.Application({
        width: config.WIDTH,
        height: config.HEIGHT
    });
    document.body.appendChild(app.view);

    const soundManager = new SoundManager();
    const winLineManager = new WinLineManager(app);
    const effectsManager = new EffectsManager(app);
    let fpsCounter: FPSCounter | null = null;

    const backgroundTexture = loader.resources['assets\\img\\background.png'].texture;
    const backgroundContainer = new PIXI.Container();
    const columnAmount = Math.ceil(config.VIEW_WIDTH / backgroundTexture.width)
    const rowAmount = Math.ceil(config.VIEW_HEIGHT / backgroundTexture.height)

    const viewwindow = new PIXI.Graphics()
    viewwindow.beginFill(0x5872f5, 0.5).drawRoundedRect(config.MARGIN, 335, config.VIEW_WIDTH, config.VIEW_HEIGHT, 20);
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
        const container = new PIXI.Container();

        const reelX = config.MARGIN + reelIndex * config.REEL_WIDTH;
        const reelY = config.MARGIN * config.VIEW_HEIGHT - (config.SYMBOLS_AMOUNT + 6) * config.SYMBOL_HEIGHT;
        container.position.set(reelX, reelY);
        reel.forEach(symbolIndex => {
            const symbol = getRandomSprite(viewwindow, imgPaths, loader, config);
            const symbolX = (config.REEL_WIDTH - symbol.width) / 2;
            const symbolY = symbolIndex * config.SYMBOL_HEIGHT;
            symbol.position.set(symbolX, symbolY)

            container.addChild(symbol)
            symbols.push(symbol)
        })

        symbols.forEach((sprite, index) => {
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
        const newReel = new Reel(container, symbols, [], blur, 0, spinTime);
        allReels.push(newReel)

        app.stage.addChild(container)
    })

    const button = new PIXI.Sprite(loader.resources['assets\\img\\btn_spin_normal.png'].texture);
    button.interactive = true;
    button.buttonMode = true;
    button.width = button.height = config.BTN_RADIUS;
    button.position.set(
        config.WIDTH - config.BTN_RADIUS,
        config.HEIGHT - config.BTN_RADIUS
    );
    button.cursor = "pointer"
    button.addListener('mouseout', () => {
        button.texture = loader.resources['assets\\img\\btn_spin_normal.png'].texture
    });
    button.addListener("pointerdown", () => {
        soundManager.playButtonClick();
        winLineManager.clearLines();
        effectsManager.clearParticles();
        (winLineManager as any).hasCheckedWins = false;
        startPlay(allReels);
    })
    app.stage.addChild(button);

    const overlay = new PIXI.Sprite(loader.resources['assets\\img\\misc.png'].texture);
    overlay.position.set(280, 300);
    overlay.width = 848;
    overlay.height = 370;
    app.stage.addChild(overlay)

    const winLineContainer = (winLineManager as any).container;
    if (winLineContainer && app.stage.children.indexOf(winLineContainer) >= 0) {
        const overlayIndex = app.stage.children.indexOf(overlay);
        if (overlayIndex >= 0) {
            const newIndex = Math.min(overlayIndex + 1, app.stage.children.length - 1);
            app.stage.setChildIndex(winLineContainer, newIndex);
        }
    }

    const particleContainer = (effectsManager as any).particleContainer;
    if (particleContainer && app.stage.children.indexOf(particleContainer) >= 0) {
        const overlayIndex = app.stage.children.indexOf(overlay);
        if (overlayIndex >= 0) {
            const newIndex = Math.min(overlayIndex + 1, app.stage.children.length - 1);
            app.stage.setChildIndex(particleContainer, newIndex);
        }
    }

    if (config.FPS_COUNTER) {
        fpsCounter = new FPSCounter(app);
        const fpsText = (fpsCounter as any).text;
        if (fpsText && app.stage.children.indexOf(fpsText) >= 0) {
            const maxIndex = app.stage.children.length - 1;
            if (maxIndex >= 0) {
                app.stage.setChildIndex(fpsText, maxIndex);
            }
        }
    }

    app.ticker.add(() => {
        if (fpsCounter) {
            fpsCounter.update();
        }

        effectsManager.updateParticles();

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

                if (!(winLineManager as any).hasCheckedWins) {
                    const wins = winLineManager.checkWins(allReels);
                    (winLineManager as any).hasCheckedWins = true;

                    if (wins.length > 0) {
                        if (config.ENABLE_WIN_LINES) {
                            winLineManager.drawWinLines(wins);
                        }

                        effectsManager.animateWinningSymbols(wins, allReels);

                        if (config.ENABLE_PARTICLES) {
                            effectsManager.createWinParticles(wins);
                        }

                        const isBigWin = wins.length >= 3;
                        soundManager.playWin(isBigWin);

                        setTimeout(() => {
                            winLineManager.clearLines();
                            effectsManager.clearParticles();
                            (winLineManager as any).hasCheckedWins = false;
                            button.interactive = true;
                            button.buttonMode = true;
                            button.texture = loader.resources['assets\\img\\btn_spin_normal.png'].texture;
                            gameStage = 'end';
                        }, config.WIN_ANIMATION_DURATION);
                    } else {
                        button.interactive = true;
                        button.buttonMode = true;
                        button.texture = loader.resources['assets\\img\\btn_spin_normal.png'].texture;
                        gameStage = 'end';
                        (winLineManager as any).hasCheckedWins = false;
                    }
                }
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
        });
        (winLineManager as any).hasCheckedWins = false;
        gameStage = 'playing';
    }
}
