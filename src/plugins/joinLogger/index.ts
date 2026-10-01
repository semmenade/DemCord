import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "JoinLogger",
    description: "Logs all  events in your servers",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        GUILD_MEMBER_ADD(data: any) {
            console.log("[JoinLogger]", data);
        }
    }
});
