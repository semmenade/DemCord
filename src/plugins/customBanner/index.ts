import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    bannerUrl: { type: OptionType.STRING, description: "Custom banner image or gif URL", default: "" }
});
export default definePlugin({
    name: "CustomBanner",
    description: "Set a custom profile banner without Nitro",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    start() {
        if (!settings.store.bannerUrl) return;
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-banner";
        this.styleEl.textContent = `[class*="banner"] { background-image: url("${settings.store.bannerUrl}") !important; background-size: cover !important; }`;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
