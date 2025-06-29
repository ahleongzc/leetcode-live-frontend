class AudioPlayerSingleton {
    private static instance: AudioPlayerSingleton;
    private audio: HTMLAudioElement | null = null;
    private isPlaying: boolean = false;

    private constructor() {}

    public static getInstance(): AudioPlayerSingleton {
        if (!AudioPlayerSingleton.instance) {
            AudioPlayerSingleton.instance = new AudioPlayerSingleton();
        }
        return AudioPlayerSingleton.instance;
    }

    public async play(src: string): Promise<void> {
        if (this.isPlaying && this.audio && !this.audio.paused && !this.audio.ended) {
            // Already playing, do not start another
            console.log("Audio is already playing");
            return;
        }
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
        }
        this.audio = new Audio(src);
        this.isPlaying = true;
        this.audio.onended = () => {
            this.isPlaying = false;
        };
        this.audio.onpause = () => {
            this.isPlaying = false;
        };
        try {
            await this.audio.play();
            console.log("Audio started");
        } catch (err) {
            this.isPlaying = false;
            console.error("Audio play failed:", err);
        }
    }

    public pause(): void {
        if (this.audio && !this.audio.paused) {
            this.audio.pause();
        }
    }

    public stop(): void {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.isPlaying = false;
        }
    }

    public isAudioPlaying(): boolean {
        return this.isPlaying;
    }
}

export default AudioPlayerSingleton;