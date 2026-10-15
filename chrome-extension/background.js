const RELEASE_BASE = "https://github.com/semmenade/DemCord/releases/latest/download";
const FILES = ["patcher.js", "preload.js", "renderer.js", "renderer.css"];

async function downloadFile(filename) {
    const res = await fetch(`${RELEASE_BASE}/${filename}`);
    if (!res.ok) throw new Error(`Failed to fetch ${filename}: ${res.status}`);
    return filename.endsWith(".css") ? await res.text() : await res.text();
}

async function updateDemCord() {
    try {
        const results = {};
        for (const file of FILES) {
            results[file] = await downloadFile(file);
        }
        await chrome.storage.local.set({ ...results, lastUpdate: Date.now() });
        console.log("[DemCord] Files updated successfully");
        return true;
    } catch(e) {
        console.error("[DemCord] Update failed:", e);
        return false;
    }
}

chrome.runtime.onInstalled.addListener(async () => {
    await updateDemCord();
    chrome.alarms.create("demcord-update", { periodInMinutes: 60 });
});

chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === "demcord-update") updateDemCord();
});

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
    if (msg.type === "GET_FILES") {
        chrome.storage.local.get(FILES, reply);
        return true;
    }
    if (msg.type === "UPDATE") {
        updateDemCord().then(success => reply({ success }));
        return true;
    }
});
