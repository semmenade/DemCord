import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "VoiceLogger",
    description: "Logs all  events in your servers",
    authors: [{ name: "DemCord", id: 0n }],
    flux: {
        VOICE_STATE_UPDATES(data: any) {
            console.log("[VoiceLogger]", data);
        }
    }
});
