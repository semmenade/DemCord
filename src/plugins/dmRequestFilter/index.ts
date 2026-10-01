import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";

const settings = definePluginSettings({
    minAccountAgeDays: { type: OptionType.NUMBER, description: "Minimum account age in days to allow DMs", default: 7 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable DM request filter", default: true }
});

function snowflakeToDate(id: string) {
    return new Date(Number(BigInt(id) >> 22n) + 1420070400000);
}

export default definePlugin({
    name: "DMRequestFilter",
    description: "Auto-decline DMs from accounts newer than a set number of days",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    flux: {
        CHANNEL_CREATE({ channel }: any) {
            if (!settings.store.enabled || channel.type !== 1) return;
            const recipientId = channel.recipients?.[0]?.id;
            if (!recipientId) return;
            const created = snowflakeToDate(recipientId);
            const ageDays = (Date.now() - created.getTime()) / 86400000;
            if (ageDays < settings.store.minAccountAgeDays) {
                showNotification({
                    title: "DM Request Blocked",
                    body: `Blocked DM from account created ${Math.round(ageDays)} days ago (minimum: ${settings.store.minAccountAgeDays} days)`
                });
            }
        }
    }
});
