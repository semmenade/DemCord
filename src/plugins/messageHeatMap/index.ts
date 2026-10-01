import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    data: { type: OptionType.STRING, description: "Heatmap data", default: "{}", hidden: true }
});
function getData() { try { return JSON.parse(settings.store.data); } catch { return {}; } }
function saveData(d: any) { settings.store.data = JSON.stringify(d); }
export default definePlugin({
    name: "MessageHeatMap",
    description: "Shows which hours you are most active",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message, optimistic }: any) {
            if (!optimistic) return;
            const d = getData();
            const key = `${new Date().toDateString()}-${new Date().getHours()}`;
            d[key] = (d[key] || 0) + 1;
            saveData(d);
        }
    },
    commands: [{
        name: "heatmap",
        description: "Show your message activity heatmap",
        execute() {
            const d = getData();
            const hours = Array.from({ length: 24 }, (_, i) => {
                const count = Object.entries(d).filter(([k]) => k.endsWith(`-${i}`)).reduce((a, [, v]: any) => a + v, 0);
                return { hour: i, count };
            });
            const max = Math.max(...hours.map(h => h.count)) || 1;
            const bars = hours.map(h => `${String(h.hour).padStart(2, "0")}:00 ${"I".repeat(Math.round((h.count / max) * 10)) || "."} (${h.count})`);
            return { content: `**Message Heatmap:**\n\`\`\`\n${bars.join("\n")}\n\`\`\`` };
        }
    }]
});
