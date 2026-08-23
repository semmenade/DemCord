import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "MessageDeleteLogger",
    description: "Logs all  events in your servers",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        MESSAGE_DELETE(data: any) {
            console.log("[MessageDeleteLogger]", data);
        }
    }
});
