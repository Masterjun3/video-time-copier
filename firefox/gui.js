const startBtn = document.getElementById("startBtn");
const endBtn = document.getElementById("endBtn");
const templateBox = document.getElementById("templateBox");
const statusText = document.getElementById("status");

let startTime = null;
let endTime = null;
let id = null;

browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
  browser.tabs.sendMessage(tabs[0].id, { action: "checkVideo" }).then(resp => {
    if (resp && resp.hasVideo) {
      startBtn.disabled = false;
      endBtn.disabled = false;
    }
  });
});

startBtn.addEventListener("click", () => {
  browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    browser.tabs.sendMessage(tabs[0].id, { action: "getTime" }).then(resp => {
      startTime = resp.time;
      id = YouTubeGetID(resp.url);
      maybeCopy();
    });
  });
});

endBtn.addEventListener("click", () => {
  browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    browser.tabs.sendMessage(tabs[0].id, { action: "getTime" }).then(resp => {
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

browser.storage.local.get("timeTemplate").then(res => {
  templateBox.value = res.timeTemplate || "{start}, {end}, {id}";
});

templateBox.addEventListener("input", () => {
  browser.storage.local.set({ timeTemplate: templateBox.value });
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
