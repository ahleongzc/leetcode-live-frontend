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

    async get(key: string): Promise<string> {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            return new Promise((resolve) => {
                chrome.storage.local.get([key], (result) => {
                    resolve(result[key] || "")
                })
            })
        } else {
            return Promise.resolve(sessionStorage.getItem(key) || "")
        }
    },

    async remove(key: string): Promise<void> {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            return new Promise((resolve) => {
                chrome.storage.local.remove([key], () => {
                    resolve()
                })
            })
        } else {
            sessionStorage.removeItem(key)
            return Promise.resolve()
        }
    }
}