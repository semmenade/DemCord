import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    data: { type: OptionType.STRING, description: "Reaction analytics data", default: "{}", hidden: true }
});
function getData() { try { return JSON.parse(settings.store.data); } catch { return {}; } }
function saveData(d: any) { settings.store.data = JSON.stringify(d); }
export default definePlugin({
    name: "ReactionAnalytics",
    description: "Tracks reaction usage and shows which reactions you use most",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_REACTION_ADD({ emoji, userId }: any) {
            const data = getData();
            const key = emoji.name || emoji.id;
            data[key] = (data[key] || 0) + 1;
            saveData(data);
        }
    },
    commands: [{
        name: "reactions",
        description: "Show your most used reactions",
        execute() {
            const data = getData();
            const sorted = Object.entries(data).sort((a: any, b: any) => b[1] - a[1]).slice(0, 10);
            if (!sorted.length) return { content: "No reaction data yet" };
            return { content: `**Most Used Reactions:**\n${sorted.map(([e, c], i) => `${i + 1}. ${e} - ${c} times`).join("\n")}` };
        }
    }]
});
