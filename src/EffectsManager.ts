import * as PIXI from 'pixi.js';
import { config } from './config';
import { WinResult } from './WinLineManager';
import Reel from './Reel';

export default class EffectsManager {
    private app: PIXI.Application;
    private particleContainer: PIXI.Container;
    private particles: PIXI.Sprite[] = [];
    private symbolAnimations: Map<PIXI.Sprite, any> = new Map();

    constructor(app: PIXI.Application) {
        this.app = app;
        this.particleContainer = new PIXI.Container();
        app.stage.addChild(this.particleContainer);
    }

    public createWinParticles(wins: WinResult[]): void {
        if (!config.ENABLE_PARTICLES) return;

        wins.forEach(win => {
            win.positions.forEach(pos => {
                const x = config.MARGIN + pos.reelIndex * config.REEL_WIDTH + config.REEL_WIDTH / 2;
                const y = 335 + pos.rowIndex * config.SYMBOL_HEIGHT + config.SYMBOL_HEIGHT / 2;
                this.spawnParticles(x, y, 20);
            });
        });
    }

    private spawnParticles(x: number, y: number, count: number): void {
        for (let i = 0; i < count; i++) {
            const particle = this.createParticle();
            particle.x = x;
            particle.y = y;

            const angle = Math.random() * Math.PI * 2;
            const speed = 2 + Math.random() * 4;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;

            const data = {
                vx,
                vy,
                life: 1.0,
                decay: 0.01 + Math.random() * 0.02,
                spin: (Math.random() - 0.5) * 0.2
            };

            (particle as any).particleData = data;
            this.particles.push(particle);
            this.particleContainer.addChild(particle);
        }
    }

    private createParticle(): PIXI.Sprite {
        const graphics = new PIXI.Graphics();
        const size = 8 + Math.random() * 8;
        const colors = [0xFFD700, 0xFFA500, 0xFF6B6B, 0x4ECDC4, 0xFFE66D];
        const color = colors[Math.floor(Math.random() * colors.length)];

        graphics.beginFill(color);
        graphics.drawCircle(0, 0, size);
        graphics.endFill();

        const texture = this.app.renderer.generateTexture(graphics, PIXI.SCALE_MODES.LINEAR, 1);
        const sprite = new PIXI.Sprite(texture);
        sprite.anchor.set(0.5);

        return sprite;
    }

    public updateParticles(): void {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            const data = (particle as any).particleData;

            if (!data) continue;

            particle.x += data.vx;
            particle.y += data.vy;
            data.vy += 0.2;

            data.life -= data.decay;
            particle.alpha = data.life;
            particle.rotation += data.spin;

            if (data.life <= 0) {
                this.particleContainer.removeChild(particle);
                particle.destroy();
                this.particles.splice(i, 1);
            }
        }
    }

    public animateWinningSymbols(wins: WinResult[], reels: Reel[]): void {
        this.clearSymbolAnimations();

        wins.forEach(win => {
            win.positions.forEach(pos => {
                const reel = reels[pos.reelIndex];
                const symbol = reel.symbols[pos.rowIndex];

                if (symbol) {
                    this.bounceSymbol(symbol);
                }
            });
        });
    }

    private bounceSymbol(symbol: PIXI.Sprite): void {
        const originalScale = symbol.scale.x;
        const startTime = Date.now();
        const duration = 600;
        const bounces = 2;

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = elapsed / duration;

            if (progress < 1) {
                const bounce = Math.abs(Math.sin(progress * Math.PI * bounces));
                const scale = originalScale + bounce * 0.15;
                symbol.scale.set(scale);
                symbol.alpha = 0.8 + Math.sin(progress * Math.PI * 4) * 0.2;

                const animId = requestAnimationFrame(animate);
                this.symbolAnimations.set(symbol, animId);
            } else {
                symbol.scale.set(originalScale);
                symbol.alpha = 1;
                this.symbolAnimations.delete(symbol);
            }
        };

        animate();
    }

    private clearSymbolAnimations(): void {
        this.symbolAnimations.forEach((animId, symbol) => {
            cancelAnimationFrame(animId);
            symbol.scale.set(symbol.scale.x / 1.15);
            symbol.alpha = 1;
        });
        this.symbolAnimations.clear();
    }

    public clearParticles(): void {
        this.particles.forEach(particle => {
            this.particleContainer.removeChild(particle);
            particle.destroy();
        });
        this.particles = [];
    }

    public destroy(): void {
        this.clearParticles();
        this.clearSymbolAnimations();
        this.particleContainer.destroy();
    }
}
