import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "NickChangeLogger",
    description: "Logs all  events in your servers",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        GUILD_MEMBER_UPDATE(data: any) {
            console.log("[NickChangeLogger]", data);
        }
    }
});
