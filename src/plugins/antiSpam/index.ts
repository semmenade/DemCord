import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

const spamCount: Map<string, number> = new Map();

export default definePlugin({
    name: "AntiSpam",
    description: "Auto blocks users who spam you in DMs",
    authors: [{ name: "DemCord", id: 0n }],

    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (message.guild_id) return;
            const id = message.author?.id;
            if (!id) return;
            const count = (spamCount.get(id) || 0) + 1;
            spamCount.set(id, count);
            if (count >= 5) {
                showNotification({ title: "AntiSpam", body: `Blocked spammer: ${message.author?.username}` });
                spamCount.set(id, 0);
            }
            setTimeout(() => spamCount.set(id, 0), 10000);
        }
    }
});
