import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    userId: { type: OptionType.STRING, description: "User ID whose messages should glow", default: "" },
    color: { type: OptionType.STRING, description: "Glow color hex", default: "#a855f7" },
    intensity: { type: OptionType.NUMBER, description: "Glow intensity 1-20", default: 8 }
});
export default definePlugin({
    name: "MessageGlow",
    description: "Adds a subtle glow effect to messages from specific users",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    start() {
        if (!settings.store.userId) return;
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-glow";
        this.styleEl.textContent = `[data-author-id="${settings.store.userId}"] [class*="contents"] { box-shadow: 0 0 ${settings.store.intensity}px ${settings.store.color}80; border-radius: 4px; }`;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
