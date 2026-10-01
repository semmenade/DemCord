import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
const recentMentions: Map<string, any> = new Map();
export default definePlugin({
    name: "AntiGhostPing",
    description: "Detects when someone mentions you and immediately deletes the message",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!message.mentions?.length) return;
            recentMentions.set(message.id, message);
            setTimeout(() => recentMentions.delete(message.id), 10000);
        },
        MESSAGE_DELETE({ id }: any) {
            const msg = recentMentions.get(id);
            if (!msg) return;
            showNotification({
                title: "Ghost Ping Detected",
                body: `${msg.author?.username} ghost pinged you: "${msg.content?.slice(0, 100)}"`,
                permanent: true
            });
            recentMentions.delete(id);
        }
    }
});
