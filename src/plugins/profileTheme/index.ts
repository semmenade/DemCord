import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    imageUrl: { type: OptionType.STRING, description: "Background image/gif URL for your profile", default: "" }
});

export default definePlugin({
    name: "ProfileTheme",
    description: "Custom animated background on your own profile card",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    start() {
        if (!settings.store.imageUrl) return;
        const style = document.createElement("style");
        style.id = "demcord-profile-theme";
        style.textContent = `[class*="userPopout"], [class*="userProfile"] { background-image: url("${settings.store.imageUrl}") !important; background-size: cover !important; background-position: center !important; }`;
        document.head.appendChild(style);
    },

    stop() { document.getElementById("demcord-profile-theme")?.remove(); }
});
