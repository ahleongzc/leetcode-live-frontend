import { type Message } from "../types";

chrome.runtime.onMessage.addListener((message: Message, _, sendResponse) => {
	switch (message.Type) {
		case "setUpInterview":
			console.log("set up interview in service worker")
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				const tabId = tabs[0].id;
				if (tabId === undefined) {
					sendResponse({ error: "unable to get tab id from service worker" })
					return
				}
				chrome.tabs.sendMessage(tabId, { Type: "setUpInterviewDOM" }, (response) => {
					sendResponse(response)
				})
			})
			return true
		case "joinInterview":
			console.log("join interview in service worker")
			chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
				const tabId = tabs[0].id;
				if (tabId === undefined) {
					sendResponse({ error: "unable to get tab id from service worker" })
					return
				}
				chrome.tabs.sendMessage(tabId, { Type: "joinInterviewDOM", InterviewToken: message.InterviewToken }, (response) => {
					console.log(response)
					sendResponse(response)
				})
			})
			return true
		case "refreshDOM":
			chrome.runtime.sendMessage({
				Type: "refresh"
			})
			return
		case "endInterviewDOM":
			chrome.runtime.sendMessage({
				Type: "endInterview"
			})
			return
	}
});

