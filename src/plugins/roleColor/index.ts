import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    showRoleColor: { type: OptionType.BOOLEAN, description: "Show role color in usernames", default: true }
});
export default definePlugin({
    name: "RoleColor",
    description: "Shows role colors on usernames throughout Discord",
    authors: [{ name: "DemCord", id: 0n }],
    settings
});
