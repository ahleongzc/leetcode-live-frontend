import authAPIs from "@/api/auth-api";
import { HTTP_STATUS, sessionID, type LoginRequest, type Message } from "../types";
import { handleAxiosError } from "@/api/axios-instance";

chrome.runtime.onMessage.addListener((message: Message, _, sendResponse) => {
	(async () => {
		switch (message.Type) {
			case "debug":
				chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
					if (tabs.length === 0 || tabs[0].id === undefined) return;
					chrome.tabs.sendMessage(tabs[0].id, message);
				})
				break
			case "login":
				if (!message.email || !message.password) {
					sendResponse(HTTP_STATUS.BAD_REQUEST)
					return
				}
				const loginRequest: LoginRequest = {
					email: message.email,
					password: message.password,
				};
				try {
					const response = await authAPIs.login(loginRequest)
					chrome.storage.local.set({ [sessionID]: response.data.session_id }, function () {
						sendResponse(HTTP_STATUS.OK)
					});
				} catch (error) {
					sendResponse(handleAxiosError(error))
				}
				break

			case "validate":
				chrome.storage.local.get([sessionID], async (result) => {
					if (result.sessionID === undefined) {
						return
					}
					try {
						const response = await authAPIs.authStatus(result.sessionID)
						sendResponse(response.status)
					} catch (error) {
						sendResponse(handleAxiosError(error))
					}
				})
				break
		}
	})()

	return true;
});

