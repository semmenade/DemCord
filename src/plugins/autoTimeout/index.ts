import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    bannedWords: { type: OptionType.STRING, description: "Words that trigger auto timeout (comma separated)", default: "" },
    duration: { type: OptionType.NUMBER, description: "Timeout duration in minutes", default: 5 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable auto timeout", default: false }
});
export default definePlugin({
    name: "AutoTimeout",
    description: "Automatically times out users who use banned words",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!settings.store.enabled || !settings.store.bannedWords || !message.guild_id) return;
            const banned = settings.store.bannedWords.split(",").map((w: string) => w.trim().toLowerCase());
            const content = message.content?.toLowerCase() || "";
            if (banned.some((w: string) => content.includes(w))) {
                showNotification({ title: "AutoTimeout", body: `${message.author?.username} used a banned word - would be timed out for ${settings.store.duration} minutes` });
            }
        }
    }
});
