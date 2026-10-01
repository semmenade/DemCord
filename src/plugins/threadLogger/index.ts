import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "ThreadLogger",
    description: "Logs all  events in your servers",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        THREAD_CREATE(data: any) {
            console.log("[ThreadLogger]", data);
        }
    }
});
