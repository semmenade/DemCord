import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    vpsUrl: { type: OptionType.STRING, description: "VPS URL to send crash logs", default: "https://79.143.181.54/demcord/crash" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable crash reporting", default: false },
    includePlugins: { type: OptionType.BOOLEAN, description: "Include active plugins in report", default: true }
});
export default definePlugin({
    name: "CrashReporter",
    description: "Automatically sends crash logs to your VPS for debugging",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    start() {
        window.addEventListener("error", this._handler = async (e: ErrorEvent) => {
            if (!settings.store.enabled || !settings.store.vpsUrl) return;
            const report = {
                message: e.message,
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno,
                stack: e.error?.stack,
                time: new Date().toISOString(),
                plugins: settings.store.includePlugins ? Object.keys(DemCord?.Plugins?.plugins || {}).filter((p: string) => DemCord.Plugins.plugins[p]?.started) : []
            };
            try {
                await fetch(settings.store.vpsUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(report) });
                console.log("[CrashReporter] Crash report sent");
            } catch {}
        });
    },
    stop() { window.removeEventListener("error", this._handler); }
});
