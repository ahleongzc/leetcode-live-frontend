import { sessionToken, type Message } from "../types";

const pendingResponses = new Map<number, (response: any) => void>();

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
	(async () => {
		switch (message.Type) {
			case "setUpInterview":
				chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
					if (tabs.length === 0 || tabs[0].id === undefined) return;

					chrome.storage.local.get([sessionToken], async (result) => {
						const msg: Message = {
							Type: "setUpInterviewDOM",
							SessionToken: result.sessionToken
						}

						if (tabs[0].id) {
							pendingResponses.set(tabs[0].id, sendResponse);
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
			case "storeSessionToken":
				if (!message.Content) {
					console.error("Message content is undefined");
					sendResponse({ error: "Message content is undefined" });
					return;
				}
				chrome.storage.local.set({ "sessionToken": message.Content }, function () {
					console.log(message.Content)
					if (chrome.runtime.lastError) {
						sendResponse({ error: chrome.runtime.lastError.message });
						return;
					}
					sendResponse();
				});
				break
			case "getSessionToken":
				chrome.storage.local.get([sessionToken], (result) => {
					const res = result.sessionToken;
					sendResponse({ sessionToken: res })
				});
				break
			case "errorDOM":
				console.log("SERVICE WORKER RECEIVED IT")
				if (sender.tab?.id && pendingResponses.has(sender.tab.id)) {
					const pendingResponse = pendingResponses.get(sender.tab.id);
					if (pendingResponse) {
						console.log("Sending error response:", message);
						pendingResponse({ error: message.error || "An error occurred in content script" });
						pendingResponses.delete(sender.tab.id);
					}
				}
				break
		}
	})()

	return true;
});

