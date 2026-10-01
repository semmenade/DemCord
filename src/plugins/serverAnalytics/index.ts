import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    data: { type: OptionType.STRING, description: "Analytics data", default: "{}", hidden: true }
});
function getData() { try { return JSON.parse(settings.store.data); } catch { return {}; } }
function saveData(d: any) { settings.store.data = JSON.stringify(d); }
export default definePlugin({
    name: "ServerAnalytics",
    description: "Detailed analytics for server activity including growth and engagement",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        GUILD_MEMBER_ADD({ guildId }: any) {
            const d = getData();
            if (!d[guildId]) d[guildId] = { joins: 0, leaves: 0 };
            d[guildId].joins++;
            saveData(d);
        },
        GUILD_MEMBER_REMOVE({ guildId }: any) {
            const d = getData();
            if (!d[guildId]) d[guildId] = { joins: 0, leaves: 0 };
            d[guildId].leaves++;
            saveData(d);
        }
    },
    commands: [{
        name: "analytics",
        description: "Show server analytics",
        execute(_, ctx) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const d = getData();
            const stats = d[ctx.guild.id] || { joins: 0, leaves: 0 };
            return { content: `**Analytics: ${ctx.guild.name}**\nJoins tracked: ${stats.joins}\nLeaves tracked: ${stats.leaves}\nNet growth: ${stats.joins - stats.leaves}` };
        }
    }]
});
