import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    theme: { type: OptionType.STRING, description: "Code block theme: dark, light, purple", default: "purple" }
});
export default definePlugin({
    name: "CodeHighlight",
    description: "Enhanced code block syntax highlighting with custom themes",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-code";
        this.styleEl.textContent = settings.store.theme === "purple"
            ? `[class*="hljs"], code { background: rgba(75,16,128,0.3) !important; border: 1px solid rgba(168,85,247,0.3) !important; border-radius: 6px !important; }`
            : "";
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
