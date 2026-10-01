import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    muted: { type: OptionType.STRING, description: "Muted channel IDs comma separated", default: "" }
});
export default definePlugin({
    name: "ChannelMuter",
    description: "Mute specific channels without leaving them",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        {
            name: "mute-channel",
            description: "Mute this channel",
            execute(_, ctx) {
                const muted = settings.store.muted.split(",").map((s: string) => s.trim()).filter(Boolean);
                if (!muted.includes(ctx.channel.id)) muted.push(ctx.channel.id);
                settings.store.muted = muted.join(",");
                return { content: `Channel muted. Use /unmute-channel to restore.` };
            }
        },
        {
            name: "unmute-channel",
            description: "Unmute this channel",
            execute(_, ctx) {
                const muted = settings.store.muted.split(",").map((s: string) => s.trim()).filter((id: string) => id !== ctx.channel.id);
                settings.store.muted = muted.join(",");
                return { content: "Channel unmuted." };
            }
        }
    ]
});
