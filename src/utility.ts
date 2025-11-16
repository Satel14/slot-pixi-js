import { ConfigType } from "./types";
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

export const getRandomSprite = (mask: PIXI.Graphics, imgPaths: string[], loader: PIXI.Loader, config: ConfigType, forceTexture?: PIXI.Texture): PIXI.Sprite => {
    const symbolsTextures = imgPaths.filter(path => /.*\\symbols\\.*/.test(path)).map(path => loader.resources[path].texture);

    let texture: PIXI.Texture;
    if (forceTexture) {
        texture = forceTexture;
    } else {
        const textureIndex = Math.floor(Math.random() * symbolsTextures.length);
        texture = symbolsTextures[textureIndex];
    }

    const sprite = new PIXI.Sprite(texture);
    sprite.mask = mask;
    sprite.scale.x = sprite.scale.y = Math.min(config.REEL_WIDTH / sprite.width, 80 / sprite.height)
    return sprite;
}
