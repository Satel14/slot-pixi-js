import { ConfigType } from './config'
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

    allReels.forEach((reel, reelIndex) => {
        if (reel.stopTime) {
            const now = Date.now();
            const phase = Math.min(1, (now - reel.stopTime) / 1000);
            const position = interpolation(0, reel.position * config.SYMBOL_HEIGHT, easing(phase));

            reel.filter.blurY = Math.abs(reel.previousPosition - position);
            reel.previousPosition = position;
            reel.container.y = position;

            if(reelIndex === allReels.length -1 && reel.reelStopped(position)){
                state = stop;
            }
        }
        else {
            reel.filter.blurY = config.SPIN_SPEED;
            reel.container.y += config.SPIN_SPEED;
        }
        if (reel.container.y >= final) {
            reel.container.y = 0;
            if (reel.isStopping()) {
                reel.stopTime = Date.now();
            }
        }
    })
}