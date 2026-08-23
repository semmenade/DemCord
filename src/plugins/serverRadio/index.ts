import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    station: { type: OptionType.STRING, description: "Radio stream URL", default: "https://streams.ilovemusic.de/iloveradio17.mp3" },
    volume: { type: OptionType.NUMBER, description: "Volume 0-100", default: 20 },
    enabled: { type: OptionType.BOOLEAN, description: "Auto-start radio on launch", default: false }
});
export default definePlugin({
    name: "ServerRadio",
    description: "Plays lo-fi or custom radio streams in the background while you chat",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    audio: null as HTMLAudioElement | null,
    start() {
        if (!settings.store.enabled) return;
        this.play();
    },
    play() {
        this.audio = new Audio(settings.store.station);
        this.audio.volume = settings.store.volume / 100;
        this.audio.loop = true;
        this.audio.play().catch(() => {});
        showNotification({ title: "ServerRadio", body: "Radio started" });
    },
    stop() {
        this.audio?.pause();
        this.audio = null;
    },
    commands: [
        { name: "radio-start", description: "Start the radio", execute() { (this as any).play(); return { content: "Radio started" }; } },
        { name: "radio-stop", description: "Stop the radio", execute() { (this as any).audio?.pause(); return { content: "Radio stopped" }; } },
        { name: "radio-volume", description: "Set radio volume", options: [{ name: "volume", description: "Volume 0-100", type: 10, required: true }], execute(opts: any[]) { const v = opts.find((o: any) => o.name === "volume")?.value; if ((this as any).audio) (this as any).audio.volume = v / 100; return { content: `Volume set to ${v}%` }; } }
    ]
});
