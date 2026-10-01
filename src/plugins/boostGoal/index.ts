import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    goal: { type: OptionType.NUMBER, description: "Boost goal to track", default: 14 }
});
export default definePlugin({
    name: "BoostGoal",
    description: "Shows a progress bar toward your server boost goal",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [{
        name: "boostgoal",
        description: "Show boost progress toward goal",
        execute(_, ctx) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const current = (ctx.guild as any).premiumSubscriptionCount || 0;
            const goal = settings.store.goal;
            const pct = Math.round((current / goal) * 100);
            const bar = "=".repeat(Math.floor(pct / 10)) + "-".repeat(10 - Math.floor(pct / 10));
            return { content: `**Boost Goal Progress**\n[${bar}] ${pct}%\n${current}/${goal} boosts` };
        }
    }]
});
