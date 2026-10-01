import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    roleId: { type: OptionType.STRING, description: "Role ID to highlight messages from", default: "" },
    color: { type: OptionType.STRING, description: "Highlight color", default: "#a855f7" }
});

export default definePlugin({
    name: "RoleHighlight",
    description: "Highlights messages from specific roles with custom colors",
    authors: [{ name: "DemCord", id: 0n }],
    settings
});
