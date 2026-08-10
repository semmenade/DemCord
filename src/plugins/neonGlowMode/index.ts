import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    color: { type: OptionType.STRING, description: "Glow color hex code", default: "#a855f7" },
    intensity: { type: OptionType.NUMBER, description: "Glow intensity 1-20", default: 8 }
});

export default definePlugin({
    name: "NeonGlowMode",
    description: "Adds neon glow outline to Discord UI elements",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    styleEl: null as HTMLStyleElement | null,

    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-neon";
        const c = settings.store.color;
        const i = settings.store.intensity;
        this.styleEl.textContent = `
            [class*="selected"], [class*="active"], [class*="focused"] {
                box-shadow: 0 0 ${i}px ${c}, 0 0 ${i * 2}px ${c}80 !important;
            }
            [class*="button"]:hover, button:hover {
                box-shadow: 0 0 ${i}px ${c} !important;
            }
            [class*="textArea"] {
                box-shadow: 0 0 ${i / 2}px ${c}60 !important;
            }
        `;
        document.head.appendChild(this.styleEl);
    },

    stop() { this.styleEl?.remove(); }
});
