import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    opacity: { type: OptionType.NUMBER, description: "Panel opacity 0-100", default: 70 },
    blur: { type: OptionType.NUMBER, description: "Backdrop blur 0-20", default: 8 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable transparent Discord", default: false }
});

export default definePlugin({
    name: "TransparentDiscord",
    description: "Makes Discord panels transparent so you can see through them",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    styleEl: null as HTMLStyleElement | null,

    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-transparent";
        document.head.appendChild(this.styleEl);
        if (settings.store.enabled) this.apply();
    },

    apply() {
        const op = (settings.store.opacity / 100).toFixed(2);
        const blur = settings.store.blur;
        if (this.styleEl) this.styleEl.textContent = `
            body, #app-mount, [class*="appMount"] { background: transparent !important; }
            [class*="sidebar"]:not([class*="message"]):not([class*="channel"]) { background: rgba(13,0,16,${op}) !important; backdrop-filter: blur(${blur}px) !important; }
            nav[class*="guilds"] { background: rgba(10,0,13,${op}) !important; backdrop-filter: blur(${blur}px) !important; }
            main[class*="chat"] { background: rgba(13,0,16,${op}) !important; backdrop-filter: blur(${blur}px) !important; }
            aside[class*="members"] { background: rgba(26,0,51,${op}) !important; backdrop-filter: blur(${blur}px) !important; }
            [class*="panels"] { background: rgba(10,0,13,${op}) !important; backdrop-filter: blur(${blur}px) !important; }
        `;
    },

    stop() { this.styleEl?.remove(); }
});
