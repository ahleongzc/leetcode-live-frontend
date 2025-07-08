import AudioPlayerSingleton from "./audio-player"

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

export default WebSocketSingleton;
