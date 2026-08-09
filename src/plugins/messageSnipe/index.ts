import definePlugin from "@utils/types";
import { addMessagePreEditListener } from "@api/MessageEvents";

const snipeCache: Map<string, any> = new Map();

export default definePlugin({
    name: "MessageSnipe",
    description: "Snipe deleted messages with /snipe",
    authors: [{ name: "DemCord", id: 0n }],

    start() {
        addMessageDeleteListener((channelId, messageId) => {
            snipeCache.set(channelId, { messageId, time: Date.now() });
        });
    },

    commands: [{
        name: "snipe",
        description: "Show the last deleted message in this channel",
        execute(_, ctx) {
            const snipe = snipeCache.get(ctx.channel.id);
            if (!snipe) return { content: "Nothing to snipe!" };
            return { content: `Last deleted message ID: ${snipe.messageId}` };
        }
    }],

    stop() { snipeCache.clear(); }
});

