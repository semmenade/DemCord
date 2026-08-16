import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    days: { type: OptionType.NUMBER, description: "Archive channels inactive for this many days", default: 30 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable auto archiver", default: false }
});
export default definePlugin({
    name: "ChannelArchiver",
    description: "Archives inactive channels automatically after a set time",
    authors: [{ name: "DemCord", id: 0n }],
    settings
});
