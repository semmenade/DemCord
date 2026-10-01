import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    font: { type: OptionType.STRING, description: "Google Font name e.g. Roboto Poppins Inter", default: "" },
    size: { type: OptionType.NUMBER, description: "Font size in px", default: 14 }
});
export default definePlugin({
    name: "CustomFonts",
    description: "Replace Discord font with any Google Font",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    linkEl: null as HTMLLinkElement | null,
    start() {
        if (!settings.store.font) return;
        this.linkEl = document.createElement("link");
        this.linkEl.rel = "stylesheet";
        this.linkEl.href = `https://fonts.googleapis.com/css2?family=${settings.store.font.replace(/ /g, "+")}&display=swap`;
        document.head.appendChild(this.linkEl);
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-fonts";
        this.styleEl.textContent = `* { font-family: "${settings.store.font}", sans-serif !important; font-size: ${settings.store.size}px !important; }`;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); this.linkEl?.remove(); }
});
