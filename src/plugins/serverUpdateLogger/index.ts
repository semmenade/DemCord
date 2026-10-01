import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "ServerUpdateLogger",
    description: "Logs all  events in your servers",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        GUILD_UPDATE(data: any) {
            console.log("[ServerUpdateLogger]", data);
        }
    }
});
