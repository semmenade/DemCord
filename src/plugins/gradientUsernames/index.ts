import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    gradient: { type: OptionType.STRING, description: "CSS gradient for usernames e.g. linear-gradient(135deg,#a855f7,#c084fc)", default: "linear-gradient(135deg,#a855f7,#c084fc)" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable gradient usernames", default: false }
});
export default definePlugin({
    name: "GradientUsernames",
    description: "Applies a gradient color to usernames in chat",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    start() {
        if (!settings.store.enabled) return;
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-gradient-names";
        this.styleEl.textContent = `[class*="username"] { background: ${settings.store.gradient}; -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }`;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
