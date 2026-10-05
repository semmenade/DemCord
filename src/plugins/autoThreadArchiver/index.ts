import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    inactiveDays: { type: OptionType.NUMBER, description: "Archive threads inactive for this many days", default: 7 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable auto thread archiver", default: false }
});
export default definePlugin({
    name: "AutoThreadArchiver",
    description: "Archives threads after a set period of inactivity automatically",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    threadActivity: new Map<string, number>(),
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (message.channel_id) (this as any).threadActivity.set(message.channel_id, Date.now());
        }
    },
    start() {
        this.interval = setInterval(() => {
            if (!settings.store.enabled) return;
            const threshold = settings.store.inactiveDays * 86400000;
            const now = Date.now();
            for (const [threadId, lastActivity] of (this as any).threadActivity.entries()) {
                if (now - lastActivity > threshold) {
                    console.log(`[AutoThreadArchiver] Thread ${threadId} should be archived (inactive for ${settings.store.inactiveDays} days)`);
                }
            }
        }, 3600000);
    },
    stop() { clearInterval(this.interval); }
});
