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
    const final = config.MARGIN;

    allReels.forEach(reel => {
        if (reel.stopTime) {
            const now = Date.now();
            const phase = Math.min(1, (now - reel.stopTime) / 1000);
            const position = interpolation(0, reel.position * config.SYMBOL_HEIGHT, easing(phase));
            reel.container.y = position;
        } 
        else {
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