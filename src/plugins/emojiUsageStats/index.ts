import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    stats: { type: OptionType.STRING, description: "Emoji usage stats", default: "{}", hidden: true }
});

function getStats() { try { return JSON.parse(settings.store.stats); } catch { return {}; } }
function saveStats(s: any) { settings.store.stats = JSON.stringify(s); }

export default definePlugin({
    name: "EmojiUsageStats",
    description: "Tracks which emojis you use most and shows usage statistics",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    flux: {
        MESSAGE_CREATE({ message, optimistic }: any) {
            if (!optimistic) return;
            const emojis = message.content?.match(/<a?:[a-zA-Z0-9_]+:[0-9]+>|[\u{1F300}-\u{1F9FF}]/gu) || [];
            if (!emojis.length) return;
            const stats = getStats();
            emojis.forEach((e: string) => { stats[e] = (stats[e] || 0) + 1; });
            saveStats(stats);
        }
    },

    commands: [{
        name: "emojistats",
        description: "Show your most used emojis",
        execute() {
            const stats = getStats();
            const sorted = Object.entries(stats).sort((a: any, b: any) => b[1] - a[1]).slice(0, 10);
            if (!sorted.length) return { content: "No emoji stats yet. Keep chatting!" };
            return { content: `**Your Most Used Emojis:**\n${sorted.map(([e, c], i) => `${i + 1}. ${e} - ${c} times`).join("\n")}` };
        }
    }]
});
