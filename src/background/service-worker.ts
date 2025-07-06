import { type Message } from "../types";

const pendingResponses = new Map<number, (response: any) => void>();

chrome.runtime.onMessage.addListener((message: Message, sender, sendResponse) => {
	(async () => {
		switch (message.Type) {
			case "setUpInterview":
				chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
					if (tabs.length === 0 || tabs[0].id === undefined) return;

					const msg: Message = {
						Type: "setUpInterviewDOM",
						SessionToken: "abc"
					}

					if (tabs[0].id) {
						pendingResponses.set(tabs[0].id, sendResponse);
					}

					chrome.tabs.sendMessage(tabs[0].id as number, msg)
				})
				break
			case "debug":
				chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
					if (tabs.length === 0 || tabs[0].id === undefined) return;
					chrome.tabs.sendMessage(tabs[0].id, message);
				})
				break
			case "errorDOM":
				if (sender.tab?.id && pendingResponses.has(sender.tab.id)) {
					const pendingResponse = pendingResponses.get(sender.tab.id);
					if (pendingResponse) {
						pendingResponse({ error: message.error || "An error occurred in content script" });
						pendingResponses.delete(sender.tab.id);
					}
				}
				break
		}
	})()

	return true;
});

