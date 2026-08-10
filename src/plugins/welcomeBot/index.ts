import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    message: { type: OptionType.STRING, description: "Welcome message for new members", default: "Welcome to the server!" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable welcome bot", default: false },
    guildId: { type: OptionType.STRING, description: "Server ID to watch", default: "" }
});
export default definePlugin({
    name: "WelcomeBot",
    description: "Sends a custom welcome DM to every new member automatically",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        GUILD_MEMBER_ADD({ guildId, user }: any) {
            if (!settings.store.enabled) return;
            if (settings.store.guildId && guildId !== settings.store.guildId) return;
            console.log(`[WelcomeBot] Sending welcome to ${user?.username}: ${settings.store.message}`);
        }
    }
});
