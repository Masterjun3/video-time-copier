browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkVideo") {
        sendResponse({ hasVideo: !!document.querySelector("video") });
    }
    if (message.action === "getTime") {
        let v = document.querySelector("video");
        sendResponse({
            time: v ? v.currentTime : null,
            url: window.location.href
        });
    }
});
