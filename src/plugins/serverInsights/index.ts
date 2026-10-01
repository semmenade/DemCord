import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    data: { type: OptionType.STRING, description: "Server insights data", default: "{}", hidden: true }
});

function getData() { try { return JSON.parse(settings.store.data); } catch { return {}; } }
function saveData(d: any) { settings.store.data = JSON.stringify(d); }

export default definePlugin({
    name: "ServerInsights",
    description: "Shows most active channels users and peak hours for any server",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!message.guild_id) return;
            const data = getData();
            const key = message.guild_id;
            if (!data[key]) data[key] = { messages: 0, channels: {}, hours: {} };
            data[key].messages++;
            data[key].channels[message.channel_id] = (data[key].channels[message.channel_id] || 0) + 1;
            const hour = new Date().getHours();
            data[key].hours[hour] = (data[key].hours[hour] || 0) + 1;
            saveData(data);
        }
    },

    commands: [{
        name: "insights",
        description: "Show insights for this server",
        execute(_, ctx) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const data = getData();
            const stats = data[ctx.guild.id];
            if (!stats) return { content: "No data yet. Keep chatting to generate insights!" };
            const topChannel = Object.entries(stats.channels).sort((a: any, b: any) => b[1] - a[1])[0];
            const topHour = Object.entries(stats.hours).sort((a: any, b: any) => b[1] - a[1])[0];
            return { content: `**Server Insights: ${ctx.guild.name}**\nTotal messages tracked: ${stats.messages}\nMost active channel: <#${topChannel?.[0]}>\nPeak hour: ${topHour?.[0]}:00` };
        }
    }]
});
