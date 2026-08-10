import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    level: { type: OptionType.NUMBER, description: "Compactness level 1-3", default: 2 }
});

export default definePlugin({
    name: "CompactMode",
    description: "Ultra compact message display showing more messages on screen",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    styleEl: null as HTMLStyleElement | null,

    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-compact";
        const l = settings.store.level;
        const padding = l === 1 ? "4px" : l === 2 ? "2px" : "0px";
        const fontSize = l === 3 ? "13px" : "inherit";
        this.styleEl.textContent = `
            [class*="message"] { padding-top: ${padding} !important; padding-bottom: ${padding} !important; min-height: unset !important; }
            [class*="contents"] { font-size: ${fontSize} !important; }
            [class*="avatar"] { width: ${l === 3 ? "28px" : "36px"} !important; height: ${l === 3 ? "28px" : "36px"} !important; }
        `;
        document.head.appendChild(this.styleEl);
    },

    stop() { this.styleEl?.remove(); }
});
