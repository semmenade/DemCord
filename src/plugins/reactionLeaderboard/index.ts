import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    data: { type: OptionType.STRING, description: "Reaction leaderboard data", default: "{}", hidden: true }
});
function getData() { try { return JSON.parse(settings.store.data); } catch { return {}; } }
function saveData(d: any) { settings.store.data = JSON.stringify(d); }
export default definePlugin({
    name: "ReactionLeaderboard",
    description: "Shows who gives and gets the most reactions in a server",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_REACTION_ADD({ userId, channelId }: any) {
            const d = getData();
            d[`giver:${userId}`] = (d[`giver:${userId}`] || 0) + 1;
            saveData(d);
        }
    },
    commands: [{
        name: "reaction-lb",
        description: "Show reaction leaderboard",
        execute() {
            const d = getData();
            const givers = Object.entries(d).filter(([k]) => k.startsWith("giver:")).map(([k, v]: any) => ({ id: k.replace("giver:", ""), count: v })).sort((a: any, b: any) => b.count - a.count).slice(0, 10);
            if (!givers.length) return { content: "No reaction data yet" };
            return { content: `**Top Reactors:**\n${givers.map((g: any, i: number) => `${i+1}. <@${g.id}>: ${g.count} reactions given`).join("\n")}` };
        }
    }]
});
