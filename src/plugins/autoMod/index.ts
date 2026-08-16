import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    bannedWords: { type: OptionType.STRING, description: "Banned words comma separated", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable automod", default: false }
});
export default definePlugin({
    name: "AutoMod",
    description: "Custom automod rules with regex support beyond Discord built-in",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!settings.store.enabled || !settings.store.bannedWords) return;
            const banned = settings.store.bannedWords.split(",").map((w: string) => w.trim().toLowerCase());
            const content = message.content?.toLowerCase() || "";
            const found = banned.find((w: string) => content.includes(w));
            if (found) showNotification({ title: "AutoMod", body: `Banned word detected: "${found}" by ${message.author?.username}` });
        }
    }
});
