import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    opacity: { type: OptionType.NUMBER, description: "Window opacity (0-100)", default: 85 },
    blur: { type: OptionType.NUMBER, description: "Background blur amount (0-20)", default: 10 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable transparent Discord", default: true }
});

export default definePlugin({
    name: "TransparentDiscord",
    description: "Makes the entire Discord window transparent so you can see through it",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    styleEl: null as HTMLStyleElement | null,

    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-transparent";
        this.apply();
        document.head.appendChild(this.styleEl);
    },

    apply() {
        const op = (settings.store.opacity / 100).toFixed(2);
        const blur = settings.store.blur;
        if (this.styleEl) this.styleEl.textContent = `
            :root { --demcord-opacity: ${op}; }
            [class*="app-"], [class*="appMount"] { background: transparent !important; }
            [class*="sidebar"], [class*="chat"], [class*="content"] {
                background: rgba(13,0,16,${op}) !important;
                backdrop-filter: blur(${blur}px) !important;
                -webkit-backdrop-filter: blur(${blur}px) !important;
            }
            [class*="panels"], [class*="member"] {
                background: rgba(26,0,51,${op}) !important;
                backdrop-filter: blur(${blur}px) !important;
            }
        `;
    },

    stop() { this.styleEl?.remove(); }
});
