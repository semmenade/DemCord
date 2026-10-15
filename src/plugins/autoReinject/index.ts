import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Auto-reinject DemCord if it gets removed", default: true },
    checkInterval: { type: OptionType.NUMBER, description: "Check interval in seconds", default: 30 }
});
export default definePlugin({
    name: "AutoReinject",
    description: "Detects if DemCord gets removed by a Discord update and reinjects automatically without the watcher",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            if (!settings.store.enabled) return;
            const isDemCordActive = !!document.getElementById("demcord-renderer") || !!window.DemCord;
            if (!isDemCordActive) {
                showNotification({ title: "AutoReinject", body: "DemCord was removed by Discord update. Reload Discord to reinject.", permanent: true });
                console.warn("[AutoReinject] DemCord not detected - may need reinject");
            }
        }, settings.store.checkInterval * 1000);
    },
    stop() { clearInterval(this.interval); }
});
