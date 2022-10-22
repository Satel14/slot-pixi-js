import { getBox } from './utility';
import { ConfigType } from './config'
import Reel from './Reel';

export default (allReels: Reel[], config: ConfigType) => {
    const final = (config.SYMBOLS_AMOUNT) * config.SYMBOL_HEIGHT + config.MARGIN;

    allReels.forEach((reel: Reel, reelIndex) => {
        reel.filter.blurY = 3 * reelIndex;

        reel.symbols.forEach(box => {
            box.y += 1;
            if (box.y >= final) {
                const deltaY = box.y = final;
                reel.remove(box);

                const newBox = getBox(config);
                const x = config.REEL_WIDTH * reelIndex + config.MARGIN;
                const y = final - config.SYMBOLS_AMOUNT * config.SYMBOL_HEIGHT + deltaY
                newBox.position.set(x, y)
                reel.add(newBox)
            }
        })
    })
}