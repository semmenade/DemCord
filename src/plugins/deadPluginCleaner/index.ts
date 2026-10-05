import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";

const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Auto-unload unused plugins", default: true },
    idleMinutes: { type: OptionType.NUMBER, description: "Minutes before unloading idle plugins", default: 30 },
    notify: { type: OptionType.BOOLEAN, description: "Show notification when unloading", default: false }
});

const PROTECTED = new Set(["Settings","NoTrack","CommandsAPI","BadgeAPI","ContextMenuAPI","MessageAccessoriesAPI","NoticesAPI","UserSettingsAPI","TokenDefender","CrashHandler","SupportHelper","InactivityManager","DeadPluginCleaner","FluxOptimizer","MemoryWatcher"]);

export default definePlugin({
    name: "DeadPluginCleaner",
    description: "Automatically unloads plugins that have not been used in the current session to free RAM",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    pluginLastUsed: new Map<string, number>(),

    start() {
        for (const name of Object.keys(DemCord.Plugins.plugins)) {
            (this as any).pluginLastUsed.set(name, Date.now());
        }
        this.interval = setInterval(() => {
            if (!settings.store.enabled) return;
            const now = Date.now();
            const threshold = settings.store.idleMinutes * 60000;
            let unloaded = 0;
            for (const [name, plugin] of Object.entries(DemCord.Plugins.plugins) as any) {
                if (PROTECTED.has(name) || !plugin.started) continue;
                const lastUsed = (this as any).pluginLastUsed.get(name) || now;
                if (now - lastUsed > threshold) {
                    try { plugin.stop?.(); plugin.started = false; unloaded++; } catch {}
                }
            }
            if (unloaded > 0 && settings.store.notify) {
                showNotification({ title: "DeadPluginCleaner", body: `Unloaded ${unloaded} idle plugins` });
            }
        }, 60000);
    },

    stop() { clearInterval(this.interval); }
});
