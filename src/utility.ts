import { ConfigType, config } from "./config";

import * as PIXI from 'pixi.js'


export const getSizeArray = (externalLength: number, internalLength: number):
    number[][] =>
    new Array(externalLength).fill(null).map(() =>
        new Array(internalLength).fill(null).map((e, index) => index))

export const getBox = (config: ConfigType) => {
    const width = config.REEL_WIDTH;
    const height = config.SYMBOL_HEIGHT;

    const box = new PIXI.Graphics()
    box.lineStyle(2, 0xff3300, 1).drawRoundedRect(0, 0, width, height, 40)
    return box
}
export const getRandomSprite = (imgPaths: string[], loader: PIXI.Loader, config: ConfigType): PIXI.Sprite => {
    const symbolsTextures = imgPaths.filter(path => /.*\\symbols\\.*/.test(path)).map(path => loader.resources[path].texture);

    const textureIndex = Math.floor(Math.random() * symbolsTextures.length)

    const sprite = new PIXI.Sprite(symbolsTextures[textureIndex]);
    sprite.scale.x = sprite.scale.y = Math.min(config.REEL_WIDTH / sprite.width, config.SYMBOL_HEIGHT / sprite.height)
    return sprite;
}