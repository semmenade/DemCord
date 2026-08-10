import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    triggers: { type: OptionType.STRING, description: "Keyword:emoji pairs e.g. fire:,lol:", default: "fire:,lol:" }
});

export default definePlugin({
    name: "AutoReact",
    description: "Auto reacts to messages containing keywords with an emoji",
    authors: [{ name: "DemCord", id: 0n }],
    settings
});

