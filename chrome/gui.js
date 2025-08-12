const startBtn = document.getElementById("startBtn");
const endBtn = document.getElementById("endBtn");
const templateBox = document.getElementById("templateBox");
const statusText = document.getElementById("status");

let startTime = null;
let endTime = null;
let id = null;

chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
	chrome.tabs.sendMessage(tabs[0].id, { action: "checkVideo" }, resp => {
		if (resp && resp.hasVideo) {
			startBtn.disabled = false;
			endBtn.disabled = false;
		}
	});
});

startBtn.addEventListener("click", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		chrome.tabs.sendMessage(tabs[0].id, { action: "getTime" }, resp => {
			startTime = resp.time;
			id = YouTubeGetID(resp.url);
			maybeCopy();
		});
	});
});

endBtn.addEventListener("click", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
		chrome.tabs.sendMessage(tabs[0].id, { action: "getTime" }, resp => {
			endTime = resp.time;
			id = YouTubeGetID(resp.url);
			maybeCopy();
		});
	});
});

function maybeCopy() {
	if (startTime !== null && endTime !== null) {
		let text = templateBox.value
			.replace("{start}", startTime.toFixed(3))
			.replace("{end}", endTime.toFixed(3))
			.replace("{id}", id);
		navigator.clipboard.writeText(text);
		statusText.innerText = "Copied!";
		setTimeout(() => statusText.innerText = "", 1000);
	}
}

chrome.storage.local.get(["timeTemplate"], res => {
	templateBox.value = res.timeTemplate || "{start}, {end}, {id}";
});

templateBox.addEventListener("input", () => {
	chrome.storage.local.set({ timeTemplate: templateBox.value });
});

function YouTubeGetID(url) {
	let ID = '';
	url = url.replace(/(>|<)/gi, '').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
	if (url[2] !== undefined) {
		ID = url[2].split(/[^0-9a-z_\-]/i);
		ID = ID[0];
	} else {
		ID = url;
	}
	return ID;
}
