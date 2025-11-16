import * as PIXI from 'pixi.js';
import { config, WIN_LINES } from './config';
import Reel from './Reel';

export interface WinResult {
    lineIndex: number;
    pattern: number[];
    symbolTexture: PIXI.Texture;
    positions: { reelIndex: number; rowIndex: number }[];
}

export default class WinLineManager {
    private container: PIXI.Container;
    private lineGraphics: PIXI.Graphics[] = [];
    private app: PIXI.Application;

    constructor(app: PIXI.Application) {
        this.app = app;
        this.container = new PIXI.Container();
        app.stage.addChild(this.container);
    }

    public checkWins(reels: Reel[]): WinResult[] {
        const wins: WinResult[] = [];

        WIN_LINES.forEach((pattern, lineIndex) => {
            const symbols: PIXI.Texture[] = [];
            const positions: { reelIndex: number; rowIndex: number }[] = [];

            pattern.forEach((rowIndex, reelIndex) => {
                if (reels[reelIndex] && reels[reelIndex].symbols[rowIndex]) {
                    const symbol = reels[reelIndex].symbols[rowIndex];
                    symbols.push(symbol.texture);
                    positions.push({ reelIndex, rowIndex });
                }
            });

            if (symbols.length === config.REEL_AMOUNT && this.allSymbolsMatch(symbols)) {
                wins.push({
                    lineIndex,
                    pattern,
                    symbolTexture: symbols[0],
                    positions
                });
            }
        });

        return wins;
    }

    private allSymbolsMatch(textures: PIXI.Texture[]): boolean {
        if (textures.length === 0) return false;
        const first = textures[0];
        return textures.every(tex => tex === first);
    }

    public drawWinLines(wins: WinResult[]): void {
        this.clearLines();

        wins.forEach((win, index) => {
            const line = new PIXI.Graphics();
            const colors = [0xFF6B6B, 0x4ECDC4, 0xFFE66D, 0x95E1D3, 0xF38181];
            const color = colors[win.lineIndex % colors.length];

            line.lineStyle(6, color, 0.8);

            win.positions.forEach((pos, i) => {
                const x = config.MARGIN + pos.reelIndex * config.REEL_WIDTH + config.REEL_WIDTH / 2;
                const y = 335 + pos.rowIndex * config.SYMBOL_HEIGHT + config.SYMBOL_HEIGHT / 2;

                if (i === 0) {
                    line.moveTo(x, y);
                } else {
                    line.lineTo(x, y);
                }
            });

            line.filters = [new PIXI.filters.BlurFilter(2)];

            this.lineGraphics.push(line);
            this.container.addChild(line);

            line.alpha = 0;
            this.fadeInLine(line, index * 200);
        });
    }

    private fadeInLine(line: PIXI.Graphics, delay: number): void {
        setTimeout(() => {
            const startTime = Date.now();
            const duration = 300;

            const animate = () => {
                const elapsed = Date.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);
                line.alpha = progress;

                if (progress < 1) {
                    requestAnimationFrame(animate);
                }
            };

            animate();
        }, delay);
    }

    public clearLines(): void {
        this.lineGraphics.forEach(line => {
            line.destroy();
        });
        this.lineGraphics = [];
    }

    public getContainer(): PIXI.Container {
        return this.container;
    }
}
