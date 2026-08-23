import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    message: { type: OptionType.STRING, description: "Farewell message (use {user} for username)", default: "{user} has left the server." },
    channelId: { type: OptionType.STRING, description: "Channel ID to send farewell messages", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable farewell messages", default: false }
});
export default definePlugin({
    name: "FarewellMessage",
    description: "Sends a farewell message when members leave the server",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        GUILD_MEMBER_REMOVE({ user }: any) {
            if (!settings.store.enabled || !settings.store.channelId) return;
            const msg = settings.store.message.replace("{user}", user?.username || "a member");
            console.log(`[FarewellMessage] Would send: ${msg} to channel ${settings.store.channelId}`);
        }
    }
});
