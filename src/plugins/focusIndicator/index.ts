import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    color: { type: OptionType.STRING, description: "Focus indicator color hex", default: "#a855f7" },
    width: { type: OptionType.NUMBER, description: "Focus border width in px", default: 2 }
});
export default definePlugin({
    name: "FocusIndicator",
    description: "Enhanced focus indicator for keyboard navigation accessibility",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-focus-indicator";
        this.styleEl.textContent = `:focus-visible { outline: ${settings.store.width}px solid ${settings.store.color} !important; outline-offset: 2px !important; border-radius: 4px !important; }`;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
