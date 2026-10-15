(async function() {
    if (!location.hostname.includes("discord.com")) return;

    async function waitForFiles(retries = 10) {
        return new Promise((resolve) => {
            chrome.runtime.sendMessage({ type: "GET_FILES" }, (files) => {
                if (files && files["renderer.js"]) resolve(files);
                else if (retries > 0) setTimeout(() => waitForFiles(retries - 1).then(resolve), 1000);
                else resolve(null);
            });
        });
    }

    const files = await waitForFiles();
    if (!files) {
        console.log("[DemCord] Files not ready - triggering update");
        chrome.runtime.sendMessage({ type: "UPDATE" });
        return;
    }

    if (files["renderer.css"]) {
        const style = document.createElement("style");
        style.id = "demcord-css";
        style.textContent = files["renderer.css"];
        (document.head || document.documentElement).appendChild(style);
    }

    if (files["renderer.js"]) {
        const script = document.createElement("script");
        script.id = "demcord-js";
        script.textContent = files["renderer.js"];
        (document.head || document.documentElement).appendChild(script);
    }

    console.log("[DemCord] Injected into Discord Web successfully");
})();
