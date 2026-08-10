import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    blurTokens: { type: OptionType.BOOLEAN, description: "Blur token-related fields when screensharing", default: true },
    blurDMs: { type: OptionType.BOOLEAN, description: "Blur DM contents when screensharing", default: false },
    enabled: { type: OptionType.BOOLEAN, description: "Enable anti-screenshare protection", default: true }
});

export default definePlugin({
    name: "AntiScreenShare",
    description: "Blurs sensitive information when screensharing is active",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    styleEl: null as HTMLStyleElement | null,

    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-antiss";
        if (settings.store.enabled && settings.store.blurTokens) {
            this.styleEl.textContent = `
                input[type="password"], input[name="token"], [class*="token"] { filter: blur(8px) !important; }
            `;
        }
        document.head.appendChild(this.styleEl);
    },

    stop() { this.styleEl?.remove(); }
});
