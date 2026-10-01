import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "MessageEditLogger",
    description: "Logs all  events in your servers",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        MESSAGE_UPDATE(data: any) {
            console.log("[MessageEditLogger]", data);
        }
    }
});
