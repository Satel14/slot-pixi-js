import * as PIXI from 'pixi.js';

export default class FPSCounter {
    private text: PIXI.Text;
    private frames: number = 0;
    private lastTime: number = performance.now();

    constructor(app: PIXI.Application) {
        this.text = new PIXI.Text('FPS: 60', {
            fontFamily: 'Arial',
            fontSize: 18,
            fill: 0x00FF00,
            stroke: 0x000000,
            strokeThickness: 3
        });

        this.text.position.set(10, 10);
        app.stage.addChild(this.text);
    }

    public update(): void {
        this.frames++;
        const currentTime = performance.now();

        if (currentTime >= this.lastTime + 1000) {
            const fps = Math.round((this.frames * 1000) / (currentTime - this.lastTime));
            this.text.text = `FPS: ${fps}`;

            if (fps >= 50) {
                this.text.style.fill = 0x00FF00;
            } else if (fps >= 30) {
                this.text.style.fill = 0xFFFF00;
            } else {
                this.text.style.fill = 0xFF0000;
            }

            this.frames = 0;
            this.lastTime = currentTime;
        }
    }

    public destroy(): void {
        this.text.destroy();
    }
}
