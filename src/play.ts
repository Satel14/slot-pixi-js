import { ConfigType } from './types'
import Reel from './Reel';
import { StateType } from './types';


const interpolation = (a: number, b: number, t: number) => {
    return a * (1 - t) + b * t;
}
const backOut = (amount: number) => {
    return (t: number) => --t * t * ((amount + 1) * t + amount) + 1;
}

const easing = backOut(2)

export default (allReels: Reel[], state: StateType, config: ConfigType) => {
    const final = config.MARGIN;
    const start = config.MARGIN + config.VIEW_HEIGHT - (config.SYMBOLS_AMOUNT + 6) * config.SYMBOL_HEIGHT;
    allReels.forEach(reel => {
        if (reel.stopTime) {
            const now = Date.now();
            const phase = Math.min(1, (now - reel.stopTime) / 1000);
            const position = interpolation(start, start + reel.position * config.SYMBOL_HEIGHT, easing(phase));

            reel.filter.blurY = Math.abs(reel.previousPosition - position);
            reel.container.y = position;


            if (reel.previousPosition - position === 0) {
                reel.isStopped = true; 
            }
            reel.previousPosition = position
        }
        else {
            reel.filter.blurY = config.SPIN_SPEED;
            reel.container.y += config.SPIN_SPEED;
        }
        if (reel.container.y >= final) {
            reel.container.y = start;
            if (reel.isStopping()) {
                reel.stopTime = Date.now();
            }
        }
    })
}