import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    format: { type: OptionType.STRING, description: "Date format e.g. MM/DD/YYYY HH:mm", default: "MM/DD/YYYY HH:mm" }
});

export default definePlugin({
    name: "CustomTimestamp",
    description: "Custom date/time format on all messages",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    patches: [{
        find: "renderCozy",
        replacement: {
            match: /(?<=timestamp.{0,50})\i\.format\(\i\)/,
            replace: "new Date($&.valueOf()).toLocaleString()"
        }
    }]
});
