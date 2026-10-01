import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";

const settings = definePluginSettings({
    threshold: { type: OptionType.NUMBER, description: "Messages per minute to trigger slowmode", default: 20 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable auto slowmode manager", default: false }
});

export default definePlugin({
    name: "SlowmodeManager",
    description: "Auto-adjusts slowmode based on message rate in a channel",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    counts: {} as Record<string, number>,
    interval: null as any,

    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!settings.store.enabled) return;
            const ch = message.channel_id;
            (this as any).counts[ch] = ((this as any).counts[ch] || 0) + 1;
        }
    },

    start() {
        this.interval = setInterval(() => {
            Object.entries((this as any).counts).forEach(([ch, count]: any) => {
                if (count >= settings.store.threshold) {
                    showNotification({ title: "SlowmodeManager", body: `High message rate in channel ${ch} - consider enabling slowmode` });
                }
            });
            (this as any).counts = {};
        }, 60000);
    },

    stop() { clearInterval(this.interval); }
});
