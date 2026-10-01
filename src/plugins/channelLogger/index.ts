import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    channels: { type: OptionType.STRING, description: "Comma separated channel IDs to log", default: "" }
});

export default definePlugin({
    name: "ChannelLogger",
    description: "Logs all messages from specific channels to console",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    flux: {
        MESSAGE_CREATE({ message, channelId }: any) {
            const watched = settings.store.channels.split(",").map((c: string) => c.trim());
            if (!watched.includes(channelId)) return;
            console.log(`[ChannelLogger] #${channelId}: ${message.author?.username}: ${message.content}`);
        }
    }
});
