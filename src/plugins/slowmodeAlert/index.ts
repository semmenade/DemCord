import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    threshold: { type: OptionType.NUMBER, description: "Alert when slowmode exceeds this many seconds", default: 30 }
});
export default definePlugin({
    name: "SlowmodeAlert",
    description: "Alerts you when a channel has high slowmode enabled",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        CHANNEL_UPDATE({ channel }: any) {
            if (!channel.rateLimitPerUser) return;
            if (channel.rateLimitPerUser >= settings.store.threshold) {
                showNotification({ title: "SlowmodeAlert", body: `#${channel.name} has ${channel.rateLimitPerUser}s slowmode enabled` });
            }
        }
    }
});
