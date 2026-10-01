import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    data: { type: OptionType.STRING, description: "Invite tracking data", default: "{}", hidden: true }
});

function getData() { try { return JSON.parse(settings.store.data); } catch { return {}; } }
function saveData(d: any) { settings.store.data = JSON.stringify(d); }

export default definePlugin({
    name: "InviteTracker",
    description: "Tracks which invites bring the most members to your server",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    flux: {
        GUILD_MEMBER_ADD({ guildId }: any) {
            const data = getData();
            if (!data[guildId]) data[guildId] = { joins: 0 };
            data[guildId].joins++;
            saveData(data);
        }
    },

    commands: [{
        name: "invites",
        description: "Show invite tracking stats for this server",
        execute(_, ctx) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const data = getData();
            const stats = data[ctx.guild.id];
            if (!stats) return { content: "No invite data yet for this server" };
            return { content: `**Invite Stats for ${ctx.guild.name}**\nTotal joins tracked: ${stats.joins}` };
        }
    }]
});
