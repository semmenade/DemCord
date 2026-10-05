import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    feed: { type: OptionType.STRING, description: "Activity feed data", default: "[]", hidden: true },
    maxEntries: { type: OptionType.NUMBER, description: "Max feed entries to keep", default: 50 }
});
function getFeed() { try { return JSON.parse(settings.store.feed); } catch { return []; } }
function saveFeed(f: any[]) { settings.store.feed = JSON.stringify(f.slice(-settings.store.maxEntries)); }
export default definePlugin({
    name: "ServerActivityFeed",
    description: "Shows recent activity across all your servers in one place",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!message.guild_id) return;
            const feed = getFeed();
            feed.push({ type: "message", author: message.author?.username, guildId: message.guild_id, channelId: message.channel_id, content: message.content?.slice(0, 100), time: Date.now() });
            saveFeed(feed);
        },
        GUILD_MEMBER_ADD({ guildId, user }: any) {
            const feed = getFeed();
            feed.push({ type: "join", user: user?.username, guildId, time: Date.now() });
            saveFeed(feed);
        }
    },
    commands: [{
        name: "feed",
        description: "Show recent activity across your servers",
        execute() {
            const feed = getFeed().slice(-15).reverse();
            if (!feed.length) return { content: "No activity recorded yet" };
            return { content: `**Server Activity Feed:**\n${feed.map((e: any) => e.type === "join" ? `[Join] ${e.user} joined a server` : `[Msg] ${e.author}: ${e.content}`).join("\n")}` };
        }
    }]
});
