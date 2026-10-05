import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    reminderMinutes: { type: OptionType.NUMBER, description: "Minutes before event to remind you", default: 15 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable event reminders", default: true }
});
export default definePlugin({
    name: "ServerEventReminder",
    description: "Get notified before scheduled Discord events start",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            if (!settings.store.enabled) return;
            console.log("[ServerEventReminder] Checking for upcoming events...");
        }, 60000);
    },
    stop() { clearInterval(this.interval); }
});
