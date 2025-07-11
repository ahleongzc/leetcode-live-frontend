import { LOCAL_STORAGE_SESSION_TOKEN_KEY } from '../types'
import { toast } from 'sonner'

export const storage = {
    async set(key: string, value: string): Promise<void> {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            return new Promise((resolve) => {
                chrome.storage.local.set({ [key]: value }, () => {
                    resolve()
                })
            })
        } else {
            sessionStorage.setItem(key, value)
            return Promise.resolve()
        }
    },

    async get(key: string): Promise<string | null> {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            return new Promise((resolve) => {
                chrome.storage.local.get([key], (result) => {
                    resolve(result[key] || null)
                })
            })
        } else {
            return Promise.resolve(sessionStorage.getItem(key) || null)
        }
    },

    async getSessionToken(): Promise<string> {
        const sessionToken = await this.get(LOCAL_STORAGE_SESSION_TOKEN_KEY);
        if (!sessionToken) {
            toast("Session expired", {
                description: "Please login to continue",
            });

            if (typeof window !== 'undefined') {
                window.location.hash = '#/login';
            }

            throw new Error("No session token found - redirected to login");
        }

        return sessionToken;
    },

    async removeSessionToken(): Promise<void> {
        try {
            await this.remove(LOCAL_STORAGE_SESSION_TOKEN_KEY);
            if (typeof window !== 'undefined') {
                window.location.hash = '#/login';
            }
        } catch (error) {
            console.error("Error removing session token:", error);
            if (typeof window !== 'undefined') {
                window.location.hash = '#/login';
            }
        }
    },

    async remove(key: string): Promise<void> {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            return new Promise((resolve, reject) => {
                chrome.storage.local.remove([key], () => {
                    if (chrome.runtime.lastError) {
                        reject(new Error(chrome.runtime.lastError.message));
                    } else {
                        resolve();
                    }
                })
            })
        } else {
            sessionStorage.removeItem(key)
            return Promise.resolve()
        }
    }
}