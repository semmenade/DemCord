import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    scores: { type: OptionType.STRING, description: "Friendship scores", default: "{}", hidden: true }
});

function getScores() { try { return JSON.parse(settings.store.scores); } catch { return {}; } }
function saveScores(s: any) { settings.store.scores = JSON.stringify(s); }

export default definePlugin({
    name: "FriendshipScore",
    description: "Rates your friendship with others based on interaction frequency",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    flux: {
        MESSAGE_CREATE({ message, optimistic }: any) {
            if (!optimistic || !message.guild_id) return;
            const scores = getScores();
            const id = message.author?.id;
            if (!id) return;
            scores[id] = (scores[id] || 0) + 1;
            saveScores(scores);
        }
    },

    commands: [{
        name: "friendship",
        description: "Show your top friends by interaction score",
        execute() {
            const scores = getScores();
            const sorted = Object.entries(scores).sort((a: any, b: any) => b[1] - a[1]).slice(0, 10);
            if (!sorted.length) return { content: "No friendship data yet. Keep chatting!" };
            return { content: `**Top Friends:**\n${sorted.map(([id, score], i) => `${i + 1}. <@${id}> - ${score} interactions`).join("\n")}` };
        }
    }]
});
