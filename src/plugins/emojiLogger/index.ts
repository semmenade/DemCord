import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "EmojiLogger",
    description: "Logs all  events in your servers",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        GUILD_EMOJIS_UPDATE(data: any) {
            console.log("[EmojiLogger]", data);
        }
    }
});
