import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    watchUserId: { type: OptionType.STRING, description: "User ID to watch for voice joins", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable auto-join", default: false }
});

export default definePlugin({
    name: "AutoJoin",
    description: "Automatically joins a voice channel when a specific friend joins",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    flux: {
        VOICE_STATE_UPDATES({ voiceStates }: any) {
            if (!settings.store.enabled || !settings.store.watchUserId) return;
            for (const state of voiceStates) {
                if (state.userId === settings.store.watchUserId && state.channelId) {
                    console.log(`[AutoJoin] ${state.userId} joined voice channel ${state.channelId}`);
                }
            }
        }
    }
});
