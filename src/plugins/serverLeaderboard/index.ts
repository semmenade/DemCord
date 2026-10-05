import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    data: { type: OptionType.STRING, description: "Leaderboard data", default: "{}", hidden: true }
});
function getData() { try { return JSON.parse(settings.store.data); } catch { return {}; } }
function saveData(d: any) { settings.store.data = JSON.stringify(d); }
export default definePlugin({
    name: "ServerLeaderboard",
    description: "Ranks members by messages sent reactions given and voice time",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!message.guild_id) return;
            const d = getData();
            const key = `${message.guild_id}:${message.author?.id}`;
            if (!d[key]) d[key] = { username: message.author?.username, messages: 0, reactions: 0 };
            d[key].messages++;
            saveData(d);
        }
    },
    commands: [{
        name: "leaderboard",
        description: "Show server message leaderboard",
        execute(_, ctx: any) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const d = getData();
            const entries = Object.entries(d).filter(([k]) => k.startsWith(ctx.guild.id)).map(([, v]: any) => v).sort((a: any, b: any) => b.messages - a.messages).slice(0, 10);
            if (!entries.length) return { content: "No leaderboard data yet" };
            return { content: `**Leaderboard: ${ctx.guild.name}**\n${entries.map((e: any, i: number) => `${i+1}. ${e.username}: ${e.messages} messages`).join("\n")}` };
        }
    }]
});
