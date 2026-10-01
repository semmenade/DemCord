import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    watchUsers: { type: OptionType.STRING, description: "User IDs to watch (comma separated)", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable voice notifications", default: true }
});
export default definePlugin({
    name: "VoiceNotify",
    description: "Get a notification when specific friends join any voice channel",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        VOICE_STATE_UPDATES({ voiceStates }: any) {
            if (!settings.store.enabled) return;
            const watched = settings.store.watchUsers.split(",").map((s: string) => s.trim()).filter(Boolean);
            for (const state of voiceStates) {
                if (watched.includes(state.userId) && state.channelId) {
                    showNotification({ title: "VoiceNotify", body: `${state.member?.nick || state.userId} joined a voice channel!` });
                }
            }
        }
    }
});
