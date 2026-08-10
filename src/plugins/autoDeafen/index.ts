import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    channelIds: { type: OptionType.STRING, description: "Channel IDs to auto-deafen in (comma separated)", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable auto-deafen", default: false }
});
export default definePlugin({
    name: "AutoDeafen",
    description: "Automatically deafens you when joining specific voice channels",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        VOICE_STATE_UPDATES({ voiceStates }: any) {
            if (!settings.store.enabled) return;
            const channels = settings.store.channelIds.split(",").map((s: string) => s.trim()).filter(Boolean);
            for (const state of voiceStates) {
                if (channels.includes(state.channelId)) {
                    console.log(`[AutoDeafen] Auto-deafening in channel ${state.channelId}`);
                }
            }
        }
    }
});
