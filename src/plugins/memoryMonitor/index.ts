import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    showInTitle: { type: OptionType.BOOLEAN, description: "Show RAM usage in window title", default: true },
    warnThreshold: { type: OptionType.NUMBER, description: "Warn when RAM exceeds this MB", default: 500 }
});

export default definePlugin({
    name: "MemoryMonitor",
    description: "Shows Discord RAM usage in the title bar and warns when too high",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    interval: null as any,

    start() {
        this.interval = setInterval(() => {
            if (!(performance as any).memory) return;
            const mb = Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024);
            if (settings.store.showInTitle) document.title = `Discord (${mb}MB)`;
        }, 5000);
    },

    stop() {
        clearInterval(this.interval);
        document.title = "Discord";
    }
});
