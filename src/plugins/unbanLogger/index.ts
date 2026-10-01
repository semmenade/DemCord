import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "UnbanLogger",
    description: "Logs all  events in your servers",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        GUILD_BAN_REMOVE(data: any) {
            console.log("[UnbanLogger]", data);
        }
    }
});
