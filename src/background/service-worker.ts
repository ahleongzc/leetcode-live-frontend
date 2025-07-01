import { sessionID, type Message } from "../types";

chrome.runtime.onMessage.addListener((message: Message, _, sendResponse) => {
	(async () => {
		switch (message.Type) {
			case "setUpInterview":
				chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
					if (tabs.length === 0 || tabs[0].id === undefined) return;

					chrome.storage.local.get("sessionID", async (result) => {
						const msg: Message = {
							Type: "setUpInterviewDOM",
							SessionID: result.sessionID
						}

						chrome.tabs.sendMessage(tabs[0].id as number, msg)
					});
				})
				break
			case "debug":
				chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
					if (tabs.length === 0 || tabs[0].id === undefined) return;
					chrome.tabs.sendMessage(tabs[0].id, message);
				})
				break
			case "storeSessionID":
				chrome.storage.local.set({ [sessionID]: message.Content }, function () {
					if (chrome.runtime.lastError) {
						sendResponse({ error: chrome.runtime.lastError.message });
						return;
					}
					sendResponse();
				});
				break
			case "getSessionID":
				chrome.storage.local.get("sessionID", (result) => {
					const res = result.sessionID;
					sendResponse({ sessionID: res })
				});
				break
		}
	})()

	return true;
});

