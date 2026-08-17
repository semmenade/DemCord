const { app, Tray, Menu, nativeImage, Notification } = require("electron");
const { execFileSync, execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const https = require("https");

app.setName("DemCord");
app.setAppUserModelId("dev.demcord");

let tray = null;
let lastDiscordVersion = "";
let currentVersion = "2.2.0";

function getInstaller() {
    return path.join(path.dirname(process.execPath), "dist", "Installer", "VencordInstallerCli.exe");
}

function getDiscordVersion() {
    try {
        const discordPath = path.join(process.env.LOCALAPPDATA, "Discord");
        return fs.readdirSync(discordPath).filter(d => d.startsWith("app-")).sort().pop();
    } catch { return ""; }
}

function inject() {
    try {
        const installer = getInstaller();
        execFileSync(installer, [], {
            env: { ...process.env, VENCORD_USER_DATA_DIR: path.dirname(process.execPath), VENCORD_DEV_INSTALL: "1" }
        });
        tray.setToolTip("DemCord - Reinjected successfully");
        notify("DemCord", "Successfully reinjected after Discord update");
    } catch(e) { console.error("[DemCord] Inject failed:", e.message); }
}

function notify(title, body) {
    new Notification({ title, body }).show();
}

function checkForUpdates() {
    const options = {
        hostname: "api.github.com",
        path: "/repos/semmenade/DemCord/releases/latest",
        headers: { "User-Agent": "DemCord-Watcher" }
    };
    https.get(options, res => {
        let data = "";
        res.on("data", chunk => data += chunk);
        res.on("end", () => {
            try {
                const release = JSON.parse(data);
                const latestVersion = release.tag_name?.replace("v", "");
                if (latestVersion && latestVersion !== currentVersion) {
                    notify("DemCord Update Available", `v${latestVersion} is available. Installing silently...`);
                    downloadAndUpdate(release);
                }
            } catch {}
        });
    }).on("error", () => {});
}

function downloadAndUpdate(release) {
    const assets = ["patcher.js", "preload.js", "renderer.js", "renderer.css"];
    const baseDir = path.dirname(process.execPath);
    const distDir = path.join(baseDir, "dist");
    if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

    let downloaded = 0;
    for (const asset of assets) {
        const assetInfo = release.assets?.find(a => a.name === asset);
        if (!assetInfo) continue;
        const url = new URL(assetInfo.browser_download_url);
        const file = fs.createWriteStream(path.join(distDir, asset));
        https.get({ hostname: url.hostname, path: url.pathname, headers: { "User-Agent": "DemCord-Watcher" } }, res => {
            res.pipe(file);
            file.on("finish", () => {
                downloaded++;
                if (downloaded === assets.length) {
                    currentVersion = release.tag_name?.replace("v", "");
                    inject();
                    notify("DemCord Updated", `Successfully updated to v${currentVersion}`);
                }
            });
        }).on("error", () => {});
    }
}

app.whenReady().then(() => {
    app.dock?.hide();

    const icon = nativeImage.createFromPath(path.join(__dirname, "demcord.ico"));
    tray = new Tray(icon);
    tray.setToolTip("DemCord - Running");

    const updateMenu = () => tray.setContextMenu(Menu.buildFromTemplate([
        { label: `DemCord v${currentVersion}`, enabled: false },
        { type: "separator" },
        { label: "Reinject Now", click: inject },
        { label: "Check for Updates", click: checkForUpdates },
        { type: "separator" },
        { label: "Quit", click: () => app.quit() }
    ]));
    updateMenu();

    // Watch Discord version for updates
    lastDiscordVersion = getDiscordVersion();
    setInterval(() => {
        const current = getDiscordVersion();
        if (current && current !== lastDiscordVersion) {
            console.log("[DemCord] Discord updated to", current);
            lastDiscordVersion = current;
            tray.setToolTip("DemCord - Reinjecting...");
            setTimeout(inject, 5000);
        }
    }, 10000);

    // Check for DemCord updates every hour
    setInterval(checkForUpdates, 3600000);

    // Check on startup after 30 seconds
    setTimeout(checkForUpdates, 30000);
});

app.on("window-all-closed", () => {});
