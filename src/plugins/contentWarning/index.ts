import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    keywords: { type: OptionType.STRING, description: "Keywords that trigger content warning (comma separated)", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable content warnings", default: false }
});
export default definePlugin({
    name: "ContentWarning",
    description: "Adds content warnings to messages containing sensitive keywords",
    authors: [{ name: "DemCord", id: 0n }],
    settings
});
