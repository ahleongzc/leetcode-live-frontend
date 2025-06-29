import { type Message } from "../types";
import axios from "axios";

chrome.runtime.onMessage.addListener(async (message: Message, _, sendResponse) => {
	if (message.Command == "startSession" || message.Command == "endSession" || message.Command == "debug") {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			if (tabs.length === 0 || tabs[0].id === undefined) return;
			chrome.tabs.sendMessage(tabs[0].id, message);
		})
		return true
	}

	switch (message.Command) {
		case "login":
			await axios.post("http://localhost:8080/v1/login").
				then((resp) => {
					chrome.storage.local.set({ "session_id": resp.data.session_id });
				})
			return true
		case "isLoggedIn":
			chrome.storage.local.get(['session_id'], (result) => {
				axios.post("http://localhost:8080/v1/login").
					then((resp) => {
						chrome.storage.local.set({ "session_id": resp.data.session_id });
					})
				return true
				if (result) {
					sendResponse(true)
				} else {
					sendResponse(false)
				}
			});
			return true
	}
}
);
