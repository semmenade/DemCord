import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

export default definePlugin({
    name: "VoiceMaster",
    description: "Shows join/leave timestamps for voice channels",
    authors: [{ name: "DemCord", id: 0n }],

    flux: {
        VOICE_STATE_UPDATES({ voiceStates }: any) {
            for (const state of voiceStates) {
                const time = new Date().toLocaleTimeString();
                if (state.channelId) {
                    showNotification({ title: "VoiceMaster", body: `${state.member?.nick || "Someone"} joined voice at ${time}` });
                } else {
                    showNotification({ title: "VoiceMaster", body: `${state.member?.nick || "Someone"} left voice at ${time}` });
                }
            }
        }
    }
});
