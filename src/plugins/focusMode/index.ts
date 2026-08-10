import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    whitelist: { type: OptionType.STRING, description: "Whitelisted channel/server IDs (comma separated)", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable focus mode", default: false }
});

export default definePlugin({
    name: "FocusMode",
    description: "Hides all servers and channels except whitelisted ones for distraction-free chatting",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    styleEl: null as HTMLStyleElement | null,

    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-focus";
        if (settings.store.enabled) this.enable();
        document.head.appendChild(this.styleEl);
    },

    enable() {
        if (this.styleEl) this.styleEl.textContent = `
            [class*="guilds"] [class*="listItem"]:not([data-whitelisted]) { opacity: 0.15; pointer-events: none; }
        `;
    },

    stop() { this.styleEl?.remove(); },

    commands: [{
        name: "focus",
        description: "Toggle focus mode",
        execute() {
            settings.store.enabled = !settings.store.enabled;
            return { content: `Focus mode ${settings.store.enabled ? "enabled" : "disabled"}` };
        }
    }]
});
