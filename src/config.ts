export const config = {
    WIDTH: 1400,
    HEIGHT: 800,
    MARGIN: 250,
    REEL_AMOUNT: 3,
    SYMBOLS_AMOUNT: 3,
    BTN_RADIUS: 100,
    SPIN_SPEED: 20,
    BASE_SPIN_DURATION: 1000,
    get VIEW_WIDTH() {
        return this.WIDTH - this.MARGIN * 2;
    },
    get VIEW_HEIGHT() {
        return this.HEIGHT - this.MARGIN * 2;
    },
    get REEL_WIDTH() {
        return this.VIEW_WIDTH / this.REEL_AMOUNT;
    },
    get SYMBOL_HEIGHT() {
        return this.VIEW_HEIGHT / this.SYMBOLS_AMOUNT;
    }
};

export type ConfigType = typeof config;