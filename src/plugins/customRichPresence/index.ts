import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    name: { type: OptionType.STRING, description: "Activity name", default: "DemCord" },
    details: { type: OptionType.STRING, description: "Activity details", default: "Using DemCord" },
    state: { type: OptionType.STRING, description: "Activity state", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable custom rich presence", default: false }
});

export default definePlugin({
    name: "CustomRichPresence",
    description: "Set a fully custom Discord rich presence with your own text and images",
    authors: [{ name: "DemCord", id: 0n }],
    settings
});
