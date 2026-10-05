import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    messageSound: { type: OptionType.STRING, description: "Message notification sound URL", default: "" },
    mentionSound: { type: OptionType.STRING, description: "Mention sound URL", default: "" },
    dmSound: { type: OptionType.STRING, description: "DM notification sound URL", default: "" },
    joinSound: { type: OptionType.STRING, description: "Voice join sound URL", default: "" },
    leaveSound: { type: OptionType.STRING, description: "Voice leave sound URL", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable custom sounds", default: false }
});
function play(url: string) { if (!url) return; try { new Audio(url).play().catch(() => {}); } catch {} }
export default definePlugin({
    name: "CustomDiscordSounds",
    description: "Replace every Discord notification sound with custom audio files",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!settings.store.enabled) return;
            const me = (window as any).DiscordNative?.remoteApp?.getCurrentUser?.()?.id;
            if (message.author?.id === me) return;
            if (message.mentions?.some((u: any) => u.id === me)) play(settings.store.mentionSound);
            else if (!message.guild_id) play(settings.store.dmSound);
            else play(settings.store.messageSound);
        },
        VOICE_STATE_UPDATES({ voiceStates }: any) {
            if (!settings.store.enabled) return;
            for (const s of voiceStates) {
                if (s.channelId) play(settings.store.joinSound);
                else play(settings.store.leaveSound);
            }
        }
    }
});
