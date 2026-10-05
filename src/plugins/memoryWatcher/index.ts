import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";

const settings = definePluginSettings({
    threshold: { type: OptionType.NUMBER, description: "RAM threshold in MB to trigger cleanup", default: 500 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable memory watcher", default: true },
    autoClear: { type: OptionType.BOOLEAN, description: "Auto-clear caches when threshold exceeded", default: true }
});

export default definePlugin({
    name: "MemoryWatcher",
    description: "Monitors RAM usage and auto-clears caches when Discord exceeds a threshold",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    lastAlert: 0,

    start() {
        this.interval = setInterval(() => {
            if (!settings.store.enabled || !(performance as any).memory) return;
            const mb = Math.round((performance as any).memory.usedJSHeapSize / 1048576);
            if (mb >= settings.store.threshold) {
                if (settings.store.autoClear) {
                    if (window.caches) window.caches.keys().then(keys => keys.forEach(k => window.caches.delete(k)));
                    try { (performance as any).memory && (window as any).gc?.(); } catch {}
                }
                const now = Date.now();
                if (now - (this as any).lastAlert > 300000) {
                    (this as any).lastAlert = now;
                    showNotification({ title: "MemoryWatcher", body: `Discord is using ${mb}MB RAM${settings.store.autoClear ? " - caches cleared" : " - consider restarting"}` });
                }
            }
        }, 30000);
    },

    stop() { clearInterval(this.interval); },

    commands: [{
        name: "memory",
        description: "Show current Discord memory usage",
        execute() {
            if (!(performance as any).memory) return { content: "Memory API not available" };
            const used = Math.round((performance as any).memory.usedJSHeapSize / 1048576);
            const total = Math.round((performance as any).memory.totalJSHeapSize / 1048576);
            const limit = Math.round((performance as any).memory.jsHeapSizeLimit / 1048576);
            return { content: `**Memory Usage:**\nUsed: ${used}MB\nTotal: ${total}MB\nLimit: ${limit}MB\nUsage: ${Math.round(used/limit*100)}%` };
        }
    }]
});
