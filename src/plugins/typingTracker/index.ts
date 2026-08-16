import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    watchUsers: { type: OptionType.STRING, description: "User IDs to watch typing (comma separated)", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable typing tracker", default: false }
});
export default definePlugin({
    name: "TypingTracker",
    description: "Get notified when specific users start typing",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        TYPING_START({ userId, channelId }: any) {
            if (!settings.store.enabled) return;
            const watched = settings.store.watchUsers.split(",").map((s: string) => s.trim()).filter(Boolean);
            if (watched.includes(userId)) {
                showNotification({ title: "TypingTracker", body: `<@${userId}> is typing in <#${channelId}>` });
            }
        }
    }
});
