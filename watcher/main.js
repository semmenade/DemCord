const { app, Tray, Menu, nativeImage } = require("electron");
const { execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");

app.setName("DemCord");
app.setAppUserModelId("dev.demcord");

let tray = null;

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
        tray.setToolTip("DemCord - Injected successfully");
        console.log("[DemCord] Reinjected successfully");
    } catch(e) {
        console.error("[DemCord] Inject failed:", e.message);
    }
}

app.whenReady().then(() => {
    app.dock?.hide();

    const icon = nativeImage.createFromDataURL('data:image/png;base64,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');

    tray = new Tray(icon);
    tray.setToolTip("DemCord - Running");

    const menu = Menu.buildFromTemplate([
        { label: "DemCord Watcher", enabled: false },
        { type: "separator" },
        { label: "Reinject Now", click: inject },
        { type: "separator" },
        { label: "Quit", click: () => app.quit() }
    ]);

    tray.setContextMenu(menu);

    let lastVersion = getDiscordVersion();
    console.log("[DemCord Watcher] Running - Discord version:", lastVersion);

    setInterval(() => {
        const current = getDiscordVersion();
        if (current && current !== lastVersion) {
            console.log("[DemCord] Discord updated to", current);
            lastVersion = current;
            tray.setToolTip("DemCord - Reinjecting...");
            setTimeout(inject, 5000);
        }
    }, 10000);
});

app.on("window-all-closed", () => {});




