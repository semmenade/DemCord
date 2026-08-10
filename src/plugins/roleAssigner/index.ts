import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";

const settings = definePluginSettings({
    rules: { type: OptionType.STRING, description: "Auto-role rules JSON", default: "[]", hidden: true },
    enabled: { type: OptionType.BOOLEAN, description: "Enable auto role assigner", default: false }
});

export default definePlugin({
    name: "RoleAssigner",
    description: "Auto-assigns roles to new members based on configurable rules",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    flux: {
        GUILD_MEMBER_ADD({ guildId, user }: any) {
            if (!settings.store.enabled) return;
            showNotification({ title: "RoleAssigner", body: `New member joined: ${user?.username}` });
        }
    }
});
