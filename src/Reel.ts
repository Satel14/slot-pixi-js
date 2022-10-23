import * as PIXI from 'pixi.js'

export default class Reel {
    public container: PIXI.Container;
    public symbols: PIXI.Graphics[];
    public filter: PIXI.filters.BlurFilter;
    public startTime: number;
    public spinTime: number;
    public position: number;
    public stopTime: number;
    constructor(container: PIXI.Container, symbols: PIXI.Graphics[], filter: PIXI.filters.BlurFilter, startTime: number, spinTime: number) {
        this.container = container;
        this.symbols = symbols;
        this.filter = filter;
        this.startTime = startTime;
        this.spinTime = spinTime;
        this.stopTime = this.stopTime;
        this.position = 0;
    }

    public add(symbol: PIXI.Graphics): void {
        this.container.addChildAt(symbol, 0)
        this.symbols.unshift(symbol)
    }
    public remove(symbol: PIXI.Graphics): void {
        symbol.destroy()
        this.symbols.pop()
    }
    public isStopping() {
        return Date.now() - this.startTime >= this.spinTime;
    }
}

