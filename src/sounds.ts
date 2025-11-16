import { Howl, Howler } from 'howler'

export const reelSpinSound = new Howl({
    src: ['assets\\sounds\\sound.mp3'],
    loop: true,
    volume: 0.5
});

export const winSound = new Howl({
    src: ['assets\\sounds\\sound.mp3'],
    volume: 0.7
});

export const bigWinSound = new Howl({
    src: ['assets\\sounds\\sound.mp3'],
    volume: 0.8
});

export const buttonClickSound = new Howl({
    src: ['assets\\sounds\\sound.mp3'],
    volume: 0.3
});

export const reelStopSound = new Howl({
    src: ['assets\\sounds\\sound.mp3'],
    volume: 0.4
});

export class SoundManager {
    private muted: boolean = false;

    public playWin(isBigWin: boolean = false): void {
        if (this.muted) return;
        if (isBigWin) {
            bigWinSound.play();
        } else {
            winSound.play();
        }
    }

    public playButtonClick(): void {
        if (this.muted) return;
        buttonClickSound.play();
    }

    public playReelStop(): void {
        if (this.muted) return;
        reelStopSound.play();
    }

    public toggleMute(): void {
        this.muted = !this.muted;
        Howler.mute(this.muted);
    }

    public setVolume(volume: number): void {
        Howler.volume(volume);
    }
}
