import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    message: { type: OptionType.STRING, description: "AFK reply message", default: "I'm AFK right now, I'll be back soon!" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable auto reply", default: false }
});

export default definePlugin({
    name: "AutoReply",
    description: "Automatically reply to DMs when AFK",
    authors: [{ name: "DemCord", id: 0n }],
    settings
});
