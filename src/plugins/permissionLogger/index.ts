import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Enable permission change logging", default: false }
});
export default definePlugin({
    name: "PermissionLogger",
    description: "Logs all permission changes in your servers",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        GUILD_ROLE_UPDATE({ role }: any) {
            if (!settings.store.enabled) return;
            showNotification({ title: "PermissionLogger", body: `Role updated: ${role?.name}` });
        }
    }
});
