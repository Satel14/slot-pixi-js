import { getBox } from './utility';
import { ConfigType } from './config'
import Reel from './Reel';
import * as d3 from 'd3-ease'

export default (allReels: Reel[], config: ConfigType) => {
    const final = (config.SYMBOLS_AMOUNT) * config.SYMBOL_HEIGHT + config.MARGIN;

    allReels.forEach((reel: Reel, reelIndex) => {
        reel.filter.blurY = 3 * reelIndex;

        const backOut = d3.easeBackOut.overshoot(3)
        const currentSpeed = backOut(0.5)
        console.log(currentSpeed);
        
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