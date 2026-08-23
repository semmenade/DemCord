import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "InviteLogger",
    description: "Logs all  events in your servers",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        INVITE_CREATE(data: any) {
            console.log("[InviteLogger]", data);
        }
    }
});
