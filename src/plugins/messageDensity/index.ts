import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    spacing: { type: OptionType.SELECT, description: "Message spacing", options: [
        { label: "Comfortable (default)", value: "comfortable", default: true },
        { label: "Cozy", value: "cozy" },
        { label: "Compact", value: "compact" },
        { label: "Ultra Compact", value: "ultra" }
    ]}
});
export default definePlugin({
    name: "MessageDensity",
    description: "Control message spacing and density",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-density";
        const styles: Record<string, string> = {
            comfortable: "",
            cozy: "[class*='message'] { padding-top: 4px !important; padding-bottom: 4px !important; }",
            compact: "[class*='message'] { padding-top: 2px !important; padding-bottom: 2px !important; min-height: unset !important; }",
            ultra: "[class*='message'] { padding: 1px 0 !important; min-height: unset !important; } [class*='avatar'] { width: 24px !important; height: 24px !important; }"
        };
        this.styleEl.textContent = styles[settings.store.spacing] || "";
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
