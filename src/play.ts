import { getBox } from './utility';
import { ConfigType } from './config'
import Reel from './Reel';


const interpolation = (a: number, b: number, t: number) => {
    return a * (1 - t) + b * t;
}
const backOut = (amount: number) => {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
}

const easing = backOut(2)

export default (allReels: Reel[], config: ConfigType) => {
    // const final = (config.SYMBOLS_AMOUNT) * config.SYMBOL_HEIGHT + config.MARGIN;
    const final = config.MARGIN;
    const stopTime = 100;

    allReels.forEach((reel: Reel, reelIndex) => {
        const isStop = Date.now() - reel.startTime >= reel.spinTime;
        if (isStop) {
            const now = Date.now();
            const phase = Math.min(1, (now - reel.startTime - 1000 * (reelIndex + 1)) / 1000 * (reelIndex + 1))
            const position = interpolation(0, 2 * config.HEIGHT, easing(phase));
            reel.container.y = position;
        } else {
            reel.container.y += 5;
        }
        if (reel.container.y >= final) {
            reel.container.y = 0
        }
    })
}