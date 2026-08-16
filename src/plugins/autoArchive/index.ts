import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    days: { type: OptionType.NUMBER, description: "Archive threads inactive for this many days", default: 7 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable auto-archive", default: false }
});
export default definePlugin({
    name: "AutoArchive",
    description: "Archives inactive threads automatically after a set time",
    authors: [{ name: "DemCord", id: 0n }],
    settings
});
