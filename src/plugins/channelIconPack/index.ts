import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    pack: { type: OptionType.STRING, description: "Icon pack name: default, neon, minimal", default: "default" }
});
export default definePlugin({
    name: "ChannelIconPack",
    description: "Custom icon pack for all channel types in the sidebar",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-chanicons";
        if (settings.store.pack === "neon") {
            this.styleEl.textContent = `[class*="channel"] svg { filter: drop-shadow(0 0 4px #a855f7); }`;
        }
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
