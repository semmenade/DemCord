import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    botPrefix: { type: OptionType.STRING, description: "Music bot prefix or slash command", default: "!" },
    botName: { type: OptionType.STRING, description: "Music bot name e.g. Groovy Rythm", default: "bot" }
});
export default definePlugin({
    name: "ServerMusicController",
    description: "Unified interface to control any music bot without knowing commands",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        { name: "music-play", description: "Play a song via music bot", options: [{ name: "query", description: "Song name or URL", type: 3, required: true }], execute(opts: any[]) { const q = opts.find((o: any) => o.name === "query")?.value; return { content: `${settings.store.botPrefix}play ${q}` }; } },
        { name: "music-skip", description: "Skip current song", execute() { return { content: `${settings.store.botPrefix}skip` }; } },
        { name: "music-stop", description: "Stop music", execute() { return { content: `${settings.store.botPrefix}stop` }; } },
        { name: "music-queue", description: "Show music queue", execute() { return { content: `${settings.store.botPrefix}queue` }; } },
        { name: "music-volume", description: "Set volume", options: [{ name: "level", description: "Volume 0-100", type: 10, required: true }], execute(opts: any[]) { const v = opts.find((o: any) => o.name === "level")?.value; return { content: `${settings.store.botPrefix}volume ${v}` }; } }
    ]
});
