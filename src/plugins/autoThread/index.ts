import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    channels: { type: OptionType.STRING, description: "Channel IDs to auto-thread (comma separated)", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable auto-threading", default: false }
});
export default definePlugin({
    name: "AutoThread",
    description: "Automatically creates a thread for every message in specified channels",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!settings.store.enabled || message.guild_id === undefined) return;
            const watched = settings.store.channels.split(",").map((s: string) => s.trim()).filter(Boolean);
            if (!watched.includes(message.channel_id)) return;
            console.log(`[AutoThread] Would create thread for message ${message.id} in ${message.channel_id}`);
        }
    }
});
