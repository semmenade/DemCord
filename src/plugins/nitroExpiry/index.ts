import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    expiryDate: { type: OptionType.STRING, description: "Nitro expiry date YYYY-MM-DD", default: "" },
    daysWarning: { type: OptionType.NUMBER, description: "Days before expiry to warn", default: 7 }
});
export default definePlugin({
    name: "NitroExpiry",
    description: "Reminds you before your Nitro subscription expires",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            if (!settings.store.expiryDate) return;
            const expiry = new Date(settings.store.expiryDate);
            const days = Math.floor((expiry.getTime() - Date.now()) / 86400000);
            if (days <= settings.store.daysWarning && days > 0) {
                showNotification({ title: "Nitro Expiry", body: `Your Nitro expires in ${days} days!` });
            }
        }, 3600000);
    },
    stop() { clearInterval(this.interval); }
});
