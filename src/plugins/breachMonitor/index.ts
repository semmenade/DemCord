import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    email: { type: OptionType.STRING, description: "Email to check for breaches", default: "" },
    lastCheck: { type: OptionType.STRING, description: "Last check date", default: "", hidden: true }
});
export default definePlugin({
    name: "BreachMonitor",
    description: "Alerts if your email appears in known data breaches via HaveIBeenPwned",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    start() {
        this.interval = setInterval(async () => {
            if (!settings.store.email) return;
            const today = new Date().toDateString();
            if (settings.store.lastCheck === today) return;
            settings.store.lastCheck = today;
            try {
                const res = await fetch(`https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(settings.store.email)}`, {
                    headers: { "User-Agent": "DemCord-BreachMonitor" }
                });
                if (res.status === 200) {
                    const data = await res.json();
                    showNotification({
                        title: "Breach Alert",
                        body: `Your email was found in ${data.length} breach(es)! Check haveibeenpwned.com for details.`,
                        color: "#f38ba8",
                        permanent: true,
                        onClick: () => window.open("https://haveibeenpwned.com")
                    });
                }
            } catch {}
        }, 3600000);
    },
    stop() { clearInterval(this.interval); }
});
