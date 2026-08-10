import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    color: { type: OptionType.STRING, description: "Scrollbar color hex", default: "#a855f7" },
    width: { type: OptionType.NUMBER, description: "Scrollbar width in px", default: 6 },
    radius: { type: OptionType.NUMBER, description: "Scrollbar border radius in px", default: 3 }
});
export default definePlugin({
    name: "CustomScrollbar",
    description: "Fully styled scrollbar with custom colors and width",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-scrollbar";
        const c = settings.store.color;
        const w = settings.store.width;
        const r = settings.store.radius;
        this.styleEl.textContent = `::-webkit-scrollbar { width: ${w}px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: ${c}; border-radius: ${r}px; } ::-webkit-scrollbar-thumb:hover { background: ${c}cc; }`;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
