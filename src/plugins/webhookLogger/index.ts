import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "WebhookLogger",
    description: "Logs all  events in your servers",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        WEBHOOKS_UPDATE(data: any) {
            console.log("[WebhookLogger]", data);
        }
    }
});
