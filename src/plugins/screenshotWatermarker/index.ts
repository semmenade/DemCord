import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    watermark: { type: OptionType.STRING, description: "Watermark text (hidden in screenshots)", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable screenshot watermarker", default: false }
});
export default definePlugin({
    name: "ScreenshotWatermarker",
    description: "Adds an invisible watermark to screenshots so you know if they leak",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    start() {
        if (!settings.store.enabled || !settings.store.watermark) return;
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-watermark";
        const wm = settings.store.watermark;
        this.styleEl.textContent = `body::after { content: "${wm}"; position: fixed; bottom: 2px; right: 4px; font-size: 8px; color: rgba(255,255,255,0.02); pointer-events: none; z-index: 99999; user-select: none; }`;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
