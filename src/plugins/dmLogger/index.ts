import definePlugin from "@utils/types";

export default definePlugin({
    name: "DMLogger",
    description: "Saves all DMs locally with timestamps",
    authors: [{ name: "DemCord", id: 0n }],

    flux: {
        MESSAGE_CREATE({ message, channelId }: any) {
            if (message.guild_id) return;
            const entry = `[${new Date().toISOString()}] ${message.author?.username}: ${message.content}\n`;
            console.log("[DMLogger]", entry);
        }
    }
});
