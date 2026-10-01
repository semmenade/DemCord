import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Show only servers with unread messages", default: false }
});
export default definePlugin({
    name: "UnreadFilter",
    description: "Shows only servers and channels with unread messages",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-unread";
        if (settings.store.enabled) {
            this.styleEl.textContent = `[class*="listItem"]:not([class*="unread"]):not([class*="mentioned"]) { opacity: 0.2; }`;
        }
        document.head.appendChild(this.styleEl);
    },
    commands: [{
        name: "unreadonly",
        description: "Toggle showing only unread channels",
        execute() {
            settings.store.enabled = !settings.store.enabled;
            return { content: `Unread filter ${settings.store.enabled ? "enabled" : "disabled"}` };
        }
    }],
    stop() { this.styleEl?.remove(); }
});
