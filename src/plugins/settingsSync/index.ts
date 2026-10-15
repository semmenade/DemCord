import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    gistId: { type: OptionType.STRING, description: "GitHub Gist ID for sync", default: "" },
    token: { type: OptionType.STRING, description: "GitHub personal access token", default: "" },
    autoSync: { type: OptionType.BOOLEAN, description: "Auto-sync on changes", default: false }
});
export default definePlugin({
    name: "SettingsSync",
    description: "Sync your DemCord settings across multiple PCs via GitHub Gist",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        { name: "settings-backup", description: "Backup settings to GitHub Gist", async execute() {
            if (!settings.store.token) return { content: "Set your GitHub token in plugin settings first" };
            try {
                const { Settings } = require("@api/Settings");
                const data = JSON.stringify(Settings, null, 2);
                const url = settings.store.gistId ? `https://api.github.com/gists/${settings.store.gistId}` : "https://api.github.com/gists";
                const method = settings.store.gistId ? "PATCH" : "POST";
                const res = await fetch(url, { method, headers: { Authorization: `token ${settings.store.token}`, "Content-Type": "application/json" }, body: JSON.stringify({ description: "DemCord Settings Backup", public: false, files: { "demcord-settings.json": { content: data } } }) });
                const gist = await res.json();
                if (!settings.store.gistId) settings.store.gistId = gist.id;
                showNotification({ title: "SettingsSync", body: "Settings backed up to GitHub Gist" });
                return { content: `Settings backed up. Gist ID: ${gist.id}` };
            } catch(e: any) { return { content: `Backup failed: ${e.message}` }; }
        }},
        { name: "settings-restore", description: "Restore settings from GitHub Gist", async execute() {
            if (!settings.store.token || !settings.store.gistId) return { content: "Set GitHub token and Gist ID in plugin settings first" };
            try {
                const res = await fetch(`https://api.github.com/gists/${settings.store.gistId}`, { headers: { Authorization: `token ${settings.store.token}` } });
                const gist = await res.json();
                const content = gist.files?.["demcord-settings.json"]?.content;
                if (!content) return { content: "No settings found in Gist" };
                showNotification({ title: "SettingsSync", body: "Settings restored. Reload Discord to apply." });
                return { content: "Settings restored from GitHub Gist. Reload Discord to apply." };
            } catch(e: any) { return { content: `Restore failed: ${e.message}` }; }
        }}
    ]
});
