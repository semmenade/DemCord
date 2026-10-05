import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    keyword: { type: OptionType.STRING, description: "Honeypot keyword to watch for", default: "demcord-honeypot" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable honeypot DM detection", default: false }
});
export default definePlugin({
    name: "HoneypotDM",
    description: "Fake trigger that alerts you if anyone tries to exploit your client",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (!settings.store.enabled || message.guild_id) return;
            if (message.content?.includes(settings.store.keyword)) {
                showNotification({ title: "HONEYPOT TRIGGERED", body: `${message.author?.username} triggered your honeypot!\nMessage: ${message.content?.slice(0, 100)}`, color: "#f38ba8", permanent: true });
            }
        }
    }
});
