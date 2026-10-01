import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "AntiSelfBot",
    description: "Detects and alerts on potential self-bot activity in your servers",
    authors: [{ name: "DemCord", id: 0n }],
    messageCounts: new Map<string, number>(),
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!message.guild_id || message.author?.bot) return;
            const id = message.author?.id;
            const count = ((this as any).messageCounts.get(id) || 0) + 1;
            (this as any).messageCounts.set(id, count);
            setTimeout(() => (this as any).messageCounts.set(id, Math.max(0, ((this as any).messageCounts.get(id) || 1) - 1)), 5000);
            if (count >= 8) {
                (this as any).messageCounts.set(id, 0);
                showNotification({ title: "AntiSelfBot", body: `${message.author?.username} may be using a self-bot (${count} messages in 5s)` });
            }
        }
    }
});
