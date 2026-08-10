import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

export default definePlugin({
    name: "AchievementTracker",
    description: "Tracks your Discord milestones like messages sent, servers joined",
    authors: [{ name: "DemCord", id: 0n }],

    stats: { messages: 0, reactions: 0, vcMinutes: 0 },

    flux: {
        MESSAGE_CREATE({ message, optimistic }: any) {
            if (!optimistic) return;
            (this as any).stats.messages++;
            const m = (this as any).stats.messages;
            if ([100, 500, 1000, 5000, 10000].includes(m)) {
                showNotification({ title: "Achievement Unlocked", body: `You have sent ${m} messages since installing DemCord!` });
            }
        }
    },

    commands: [{
        name: "stats",
        description: "Show your DemCord session stats",
        execute() {
            const s = (this as any).stats;
            return { content: `Session stats:\nMessages sent: ${s.messages}\nReactions added: ${s.reactions}` };
        }
    }]
});
