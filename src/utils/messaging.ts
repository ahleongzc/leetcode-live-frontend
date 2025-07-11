export const messaging = {
    async sendMessage(message: any): Promise<any> {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
            return new Promise((resolve, reject) => {
                chrome.runtime.sendMessage(message, (response) => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else if (response?.error) {
                        reject(new Error(response.error));
                    } else {
                        resolve(response);
                    }
                });
            });
        } else {
            switch (message.Type) {
                case "setUpInterview":
                    return new Promise((resolve) => {
                        resolve({
                            description: "test",
                            questionID: "test",
                        })
                    })
                case "joinInterview":
                    await WebSocketSingleton.getInstance().connect("ws://localhost:8000/v1/interview/join", {
                        token: message.InterviewToken,
                    });
                    const socket = WebSocketSingleton.getInstance().getSocket();
                    if (!socket) {
                        throw new Error("Failed to get WebSocket instance");
                    }
                    break
                default:
                    throw new Error(`Unsupported message type: ${message.Type}`);
            }
        }
    }
};

class WebSocketSingleton {
    private static instance: WebSocketSingleton;
    private socket: WebSocket | null;

    private constructor() {
        this.socket = null
    }

    public static getInstance(): WebSocketSingleton {
        if (!WebSocketSingleton.instance) {
            WebSocketSingleton.instance = new WebSocketSingleton();
        }
        return WebSocketSingleton.instance;
    }

    public setOnMessageHandler(handler: (event: MessageEvent) => Promise<void>) {
        if (this.socket) {
            this.socket.onmessage = async (event) => {
                await handler(event);
            };
        }
    }

    public send(message: string) {
        if (this.socket) {
            if (this.socket.readyState === WebSocket.OPEN) {
                this.socket.send(message);
            } else {
                console.warn("WebSocket is not open");
            }
        }
    }

    public closeSocket() {
        if (this.socket) {
            this.socket.close()
        }
    }

    public getSocket(): WebSocket | null {
        return this.socket;
    }

    public connect(host: string, params?: Record<string, string>): Promise<void> {
        return new Promise((resolve, reject) => {
            const queryString = params ? `?${new URLSearchParams(params).toString()}` : "";
            const urlWithParams = `${host}${queryString}`;

            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                reject(new Error("websocket already connected, close existing connection first"))
                return
            }

            try {
                this.socket = new WebSocket(urlWithParams);
            } catch (error) {
                reject(new Error("join interview failed"));
                return
            }

            this.socket.onerror = () => {
                reject(new Error("join interview failed"));
            };

            this.socket.onopen = () => {
                resolve();
            }

            this.socket.onmessage = async (message) => {
                try {
                    const data = JSON.parse(message.data)
                    await AudioPlayerSingleton.getInstance().play(data.url)
                } catch (error) {
                    console.log(error)
                }
            }
        })
    }
}
class AudioPlayerSingleton {
    private static instance: AudioPlayerSingleton;
    private audio: HTMLAudioElement | null = null;
    private isPlaying: boolean = false;

    private constructor() { }

    public static getInstance(): AudioPlayerSingleton {
        if (!AudioPlayerSingleton.instance) {
            AudioPlayerSingleton.instance = new AudioPlayerSingleton();
        }
        return AudioPlayerSingleton.instance;
    }

    public async play(src: string): Promise<void> {
        if (this.isPlaying && this.audio && !this.audio.paused && !this.audio.ended) {
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