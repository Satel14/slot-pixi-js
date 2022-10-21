import { getBox } from './utility';
import * as PIXI from 'pixi.js'
import { ConfigType } from './config'

export default (stage: PIXI.Container, config: ConfigType) => {
    const final = (config.SYMBOLS_AMOUNT) * config.SYMBOL_HEIGHT + config.MARGIN;

    stage.children.forEach((container: PIXI.Container, reelIndex) => {
        container.children.forEach(box => {
            box.y += 1;
            if (box.y >= final) {
                const deltaY = box.y = final;
                container.removeChild(box);

                const newBox = getBox(config);
                const x = config.REEL_WIDTH * reelIndex + config.MARGIN;
                const y = final - config.SYMBOLS_AMOUNT * config.SYMBOL_HEIGHT + deltaY
                newBox.position.set(x, y)
                container.addChildAt(newBox, 0)
            }
        })
    })
}