import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    leaderboard: { type: OptionType.STRING, description: "Leaderboard data", default: "{}", hidden: true }
});
function getLB() { try { return JSON.parse(settings.store.leaderboard); } catch { return {}; } }
function saveLB(d: any) { settings.store.leaderboard = JSON.stringify(d); }
export default definePlugin({
    name: "DPLeaderboard",
    description: "Shows DemCord Points leaderboard per server",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [{
        name: "dp-leaderboard",
        description: "Show DP leaderboard for this server",
        execute(_, ctx: any) {
            const lb = getLB();
            const entries = Object.entries(lb).sort((a: any, b: any) => b[1] - a[1]).slice(0, 10);
            if (!entries.length) return { content: "No leaderboard data yet. Earn DP to appear here!" };
            return { content: `**DemCord Points Leaderboard:**\n${entries.map(([id, pts]: any, i: number) => `${i+1}. <@${id}>: ${pts} DP`).join("\n")}` };
        }
    }]
});
