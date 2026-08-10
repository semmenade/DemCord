import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "VoiceChannelTimer",
    description: "Shows how long you have been in a voice channel with a live timer",
    authors: [{ name: "DemCord", id: 0n }],
    joinTime: null as number | null,
    interval: null as any,
    flux: {
        VOICE_STATE_UPDATES({ voiceStates }: any) {
            const self = voiceStates.find((s: any) => s.userId === (window as any).DiscordNative?.remoteApp?.getCurrentUser?.()?.id);
            if (!self) return;
            if (self.channelId && !(this as any).joinTime) {
                (this as any).joinTime = Date.now();
                (this as any).interval = setInterval(() => {
                    const elapsed = Math.floor((Date.now() - (this as any).joinTime) / 1000);
                    const m = Math.floor(elapsed / 60);
                    const s = elapsed % 60;
                    document.title = `Discord - VC: ${m}:${s.toString().padStart(2, "0")}`;
                }, 1000);
            } else if (!self.channelId) {
                clearInterval((this as any).interval);
                (this as any).joinTime = null;
                document.title = "Discord";
            }
        }
    },
    stop() { clearInterval(this.interval); document.title = "Discord"; }
});
