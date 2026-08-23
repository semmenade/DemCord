import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    message: { type: OptionType.STRING, description: "Welcome message (use {user} for username)", default: "Welcome to the server, {user}!" },
    channelId: { type: OptionType.STRING, description: "Channel ID to send welcome messages", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable welcome messages", default: false }
});
export default definePlugin({
    name: "WelcomeMessage",
    description: "Sends a custom welcome message when new members join",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        GUILD_MEMBER_ADD({ user }: any) {
            if (!settings.store.enabled || !settings.store.channelId) return;
            const msg = settings.store.message.replace("{user}", user?.username || "new member");
            console.log(`[WelcomeMessage] Would send: ${msg} to channel ${settings.store.channelId}`);
        }
    }
});
