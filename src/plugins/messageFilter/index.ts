import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    filters: { type: OptionType.STRING, description: "Words to filter from view (comma separated)", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable message filter", default: false }
});
export default definePlugin({
    name: "MessageFilter",
    description: "Hides messages containing specific words from your view",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-filter";
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
