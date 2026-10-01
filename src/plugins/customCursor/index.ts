import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    url: { type: OptionType.STRING, description: "Custom cursor image URL (32x32 recommended)", default: "" }
});
export default definePlugin({
    name: "CustomCursor",
    description: "Replace your mouse cursor inside Discord with a custom image",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    start() {
        if (!settings.store.url) return;
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-cursor";
        this.styleEl.textContent = `* { cursor: url("${settings.store.url}"), auto !important; }`;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
