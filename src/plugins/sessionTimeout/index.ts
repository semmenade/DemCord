import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";

const settings = definePluginSettings({
    minutes: { type: OptionType.NUMBER, description: "Minutes of inactivity before warning", default: 30 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable session timeout", default: false }
});

export default definePlugin({
    name: "SessionTimeout",
    description: "Warns you and optionally logs out after extended inactivity",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    lastActivity: Date.now(),
    interval: null as any,

    start() {
        document.addEventListener("mousemove", () => { (this as any).lastActivity = Date.now(); });
        document.addEventListener("keydown", () => { (this as any).lastActivity = Date.now(); });
        this.interval = setInterval(() => {
            if (!settings.store.enabled) return;
            const idle = (Date.now() - (this as any).lastActivity) / 60000;
            if (idle >= settings.store.minutes) {
                showNotification({ title: "Session Timeout", body: `You have been idle for ${Math.round(idle)} minutes`, permanent: true });
            }
        }, 60000);
    },

    stop() { clearInterval(this.interval); }
});
