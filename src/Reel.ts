import * as PIXI from 'pixi.js'

export default class Reel {
    container: PIXI.Container;
    symbols: PIXI.Graphics[];
    filter: PIXI.filters.BlurFilter;
    constructor(container: PIXI.Container, symbols: PIXI.Graphics[], filter: PIXI.filters.BlurFilter) {
        this.container = container;
        this.symbols = symbols;
        this.filter = filter;
    }

    public add(symbol: PIXI.Graphics): void {
        this.container.addChildAt(symbol, 0)
        this.symbols.unshift(symbol)
    }
    public remove(symbol: PIXI.Graphics): void {
        symbol.destroy()
        this.symbols.pop()
    }
}

