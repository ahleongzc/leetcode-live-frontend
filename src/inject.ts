(() => {
    let latestCode = "";

    function setupMonacoListener() {
        if (
            typeof window.monaco !== "undefined" &&
            window.monaco.editor.getModels().length > 0
        ) {
            const model = window.monaco.editor.getModels()[0];
            latestCode = model.getValue();

            model.onDidChangeContent(() => {
                latestCode = model.getValue();
            });

            return true;
        }
        return false;
    }

    if (!setupMonacoListener()) {
        const observer = new MutationObserver(() => {
            if (setupMonacoListener()) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener("message", (event) => {
        if (event.source !== window) return;
        if (event.data?.type === "REQUEST_MONACO_CODE") {
            window.postMessage({ type: "RESPONSE_MONACO_CODE", code: latestCode }, "*");
        }
    });
})();
