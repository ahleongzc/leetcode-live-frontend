import { type Message } from "../types";
import axios from "axios";

chrome.runtime.onMessage.addListener(async (message: Message) => {
	// if (message.Command == "startSession" || message.Command == "endSession" || message.Command == "debug") {
	// 	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
	// 		if (tabs.length === 0 || tabs[0].id === undefined) return;
	// 		chrome.tabs.sendMessage(tabs[0].id, message);
	// 	})
	// 	return true
	// }

	switch (message.Type) {
		case "auth":
			await axios.post("http://localhost:8080/v1/login").
				then((resp) => {
					chrome.storage.local.set({ "session_id": resp.data.session_id });
				})
			return true
		default:
			return
	}
});
