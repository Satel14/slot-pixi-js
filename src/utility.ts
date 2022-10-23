import { ConfigType } from "./config";

import * as PIXI from 'pixi.js'


export const getSizeArray = (externalLength: number, internalLength: number):
    number[][] =>
    new Array(externalLength).fill(null).map(() =>
        new Array(internalLength).fill(null).map((e, index) => index))

export const getBox = (config: ConfigType) => {
    const width = config.REEL_WIDTH;
    const height = config.SYMBOL_HEIGHT;

    const box = new PIXI.Graphics()
    box.lineStyle(4, 0xff3300, 1).drawRoundedRect(0, 0, width, height, 20)
    return box
}