import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    data: { type: OptionType.STRING, description: "Analytics data", default: "{}", hidden: true }
});
function getData() { try { return JSON.parse(settings.store.data); } catch { return {}; } }
function saveData(d: any) { settings.store.data = JSON.stringify(d); }
export default definePlugin({
    name: "ServerAnalyticsDashboard",
    description: "Full server analytics dashboard with message counts active users and growth",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!message.guild_id) return;
            const d = getData();
            const g = message.guild_id;
            if (!d[g]) d[g] = { messages: 0, users: {}, channels: {}, hourly: {} };
            d[g].messages++;
            d[g].users[message.author?.id] = (d[g].users[message.author?.id] || 0) + 1;
            d[g].channels[message.channel_id] = (d[g].channels[message.channel_id] || 0) + 1;
            const hour = new Date().getHours();
            d[g].hourly[hour] = (d[g].hourly[hour] || 0) + 1;
            saveData(d);
        }
    },
    commands: [{
        name: "analytics-dashboard",
        description: "Show full server analytics",
        execute(_, ctx: any) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const d = getData();
            const g = d[ctx.guild.id];
            if (!g) return { content: "No analytics data yet for this server" };
            const topUser = Object.entries(g.users).sort((a: any, b: any) => b[1] - a[1])[0];
            const topChannel = Object.entries(g.channels).sort((a: any, b: any) => b[1] - a[1])[0];
            const peakHour = Object.entries(g.hourly).sort((a: any, b: any) => b[1] - a[1])[0];
            return { content: `**Analytics: ${ctx.guild.name}**\nTotal messages: ${g.messages}\nMost active user: <@${topUser?.[0]}> (${topUser?.[1]} msgs)\nMost active channel: <#${topChannel?.[0]}>\nPeak hour: ${peakHour?.[0]}:00 (${peakHour?.[1]} msgs)` };
        }
    }]
});
