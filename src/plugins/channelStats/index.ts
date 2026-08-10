import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    data: { type: OptionType.STRING, description: "Channel stats data", default: "{}", hidden: true }
});

function getData() { try { return JSON.parse(settings.store.data); } catch { return {}; } }
function saveData(d: any) { settings.store.data = JSON.stringify(d); }

export default definePlugin({
    name: "ChannelStats",
    description: "Shows message count and activity stats per channel",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    flux: {
        MESSAGE_CREATE({ message }: any) {
            const data = getData();
            const ch = message.channel_id;
            if (!data[ch]) data[ch] = { count: 0, lastMessage: null };
            data[ch].count++;
            data[ch].lastMessage = Date.now();
            saveData(data);
        }
    },

    commands: [{
        name: "chanstats",
        description: "Show stats for this channel",
        execute(_, ctx) {
            const data = getData();
            const stats = data[ctx.channel.id];
            if (!stats) return { content: "No stats yet for this channel" };
            const last = stats.lastMessage ? new Date(stats.lastMessage).toLocaleString() : "Never";
            return { content: `**Channel Stats**\nMessages tracked: ${stats.count}\nLast message: ${last}` };
        }
    }]
});
