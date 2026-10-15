import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Enable memory leak detection", default: true },
    growthThreshold: { type: OptionType.NUMBER, description: "MB growth per minute to flag as leak", default: 50 }
});
export default definePlugin({
    name: "MemoryLeakDetector",
    description: "Detects memory leaks by monitoring heap growth over time",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    samples: [] as number[],
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            if (!settings.store.enabled || !(performance as any).memory) return;
            const mb = Math.round((performance as any).memory.usedJSHeapSize / 1048576);
            (this as any).samples.push(mb);
            if ((this as any).samples.length > 10) (this as any).samples.shift();
            if ((this as any).samples.length < 5) return;
            const growth = (this as any).samples[(this as any).samples.length - 1] - (this as any).samples[0];
            if (growth > settings.store.growthThreshold) {
                showNotification({ title: "Memory Leak Detected", body: `Discord RAM grew ${growth}MB in the last 5 minutes. Consider restarting.` });
                (this as any).samples = [];
            }
        }, 60000);
    },
    stop() { clearInterval(this.interval); }
});
