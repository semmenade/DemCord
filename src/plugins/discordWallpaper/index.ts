import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    url: { type: OptionType.STRING, description: "Wallpaper image or gif URL", default: "" },
    blur: { type: OptionType.NUMBER, description: "Blur amount 0-20", default: 5 },
    opacity: { type: OptionType.NUMBER, description: "Opacity 0-100", default: 30 }
});
export default definePlugin({
    name: "DiscordWallpaper",
    description: "Set a custom animated wallpaper behind Discord",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    start() {
        if (!settings.store.url) return;
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-wallpaper";
        this.styleEl.textContent = `
            body::before { content: ""; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: url("${settings.store.url}") center/cover no-repeat; filter: blur(${settings.store.blur}px); opacity: ${settings.store.opacity / 100}; z-index: -1; pointer-events: none; }
        `;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
