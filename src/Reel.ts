import * as PIXI from 'pixi.js'

export default class Reel {
    public container: PIXI.Container;
    public symbols: PIXI.Sprite[];
    public filter: PIXI.filters.BlurFilter;
    public startTime: number;
    public spinTime: number;
    public position: number;
    public stopTime: number;
    public isStopped: boolean;
    public previousPosition: number | null;
    public rectangles: PIXI.Graphics[];
    constructor(container: PIXI.Container, symbols: PIXI.Sprite[], rectangles: PIXI.Graphics[], filter: PIXI.filters.BlurFilter, startTime: number, spinTime: number) {
        this.container = container;
        this.symbols = symbols;
        this.filter = filter;
        this.startTime = startTime;
        this.spinTime = spinTime;
        this.position = 0;
        this.stopTime = 0;
        this.rectangles = rectangles;
        this.previousPosition = null;
        this.isStopped = false;
    }

    public add(symbol: PIXI.Sprite): void {
        this.container.addChildAt(symbol, 0)
        this.symbols.unshift(symbol)
    }
    public remove(symbol: PIXI.Sprite) {
        symbol.destroy()
        this.symbols.pop()
    }
    public isStopping() {
        return Date.now() - this.startTime >= this.spinTime;
    }
    public reelStopped(currentPosition: number) {
        return this.previousPosition !== null && this.previousPosition - currentPosition === 0;
    }
    public removeRect(rectangles: PIXI.Graphics) {
        rectangles.destroy()
        this.rectangles.pop()
    }
    public addRect(rectangles: PIXI.Graphics): void {
        this.container.addChildAt(rectangles, 0);
        this.rectangles.unshift(rectangles)
    }
}
