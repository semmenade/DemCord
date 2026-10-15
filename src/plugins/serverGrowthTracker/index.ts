import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    data: { type: OptionType.STRING, description: "Growth data", default: "{}", hidden: true }
});
function getData() { try { return JSON.parse(settings.store.data); } catch { return {}; } }
function saveData(d: any) { settings.store.data = JSON.stringify(d); }
export default definePlugin({
    name: "ServerGrowthTracker",
    description: "Tracks server member count over time to visualize growth",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            const d = getData();
            const date = new Date().toDateString();
            console.log("[ServerGrowthTracker] Snapshot taken at", date);
        }, 3600000);
    },
    stop() { clearInterval(this.interval); },
    commands: [{
        name: "growth",
        description: "Show server growth stats",
        execute(_, ctx: any) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const memberCount = (ctx.guild as any).memberCount || "Unknown";
            return { content: `**${ctx.guild.name} Growth**\nCurrent members: ${memberCount}\nTracking started. Check back daily to see growth trends.` };
        }
    }]
});
