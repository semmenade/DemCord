import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    interval: { type: OptionType.NUMBER, description: "Cleanup interval in minutes", default: 10 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable auto garbage collector", default: true }
});
export default definePlugin({
    name: "AutoGarbageCollector",
    description: "Automatically cleans up Discord caches and unused memory on a schedule",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            if (!settings.store.enabled) return;
            if (window.caches) window.caches.keys().then(keys => keys.forEach(k => window.caches.delete(k)));
            try { (window as any).gc?.(); } catch {}
            document.querySelectorAll("img[src]:not([class])").forEach((img: any) => {
                if (!img.closest("[class]")) img.remove();
            });
            console.log("[AutoGarbageCollector] Cleaned up at", new Date().toLocaleTimeString());
        }, settings.store.interval * 60000);
    },
    stop() { clearInterval(this.interval); }
});
