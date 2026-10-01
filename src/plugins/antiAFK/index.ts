import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    interval: { type: OptionType.NUMBER, description: "Minutes between anti-AFK actions", default: 4 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable anti-AFK", default: false }
});
export default definePlugin({
    name: "AntiAFK",
    description: "Prevents Discord from marking you as AFK by simulating activity",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            if (!settings.store.enabled) return;
            window.dispatchEvent(new MouseEvent("mousemove", { clientX: Math.random() * 100, clientY: Math.random() * 100 }));
        }, settings.store.interval * 60000);
    },
    stop() { clearInterval(this.interval); }
});
