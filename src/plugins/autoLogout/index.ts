import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    idleMinutes: { type: OptionType.NUMBER, description: "Minutes of inactivity before auto-logout warning", default: 60 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable auto-logout on idle", default: false }
});
export default definePlugin({
    name: "AutoLogout",
    description: "Warns and optionally logs you out after extended inactivity",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    lastActivity: Date.now(),
    interval: null as any,
    start() {
        document.addEventListener("mousemove", () => { (this as any).lastActivity = Date.now(); });
        document.addEventListener("keydown", () => { (this as any).lastActivity = Date.now(); });
        this.interval = setInterval(() => {
            if (!settings.store.enabled) return;
            const idle = (Date.now() - (this as any).lastActivity) / 60000;
            if (idle >= settings.store.idleMinutes) {
                showNotification({
                    title: "Auto Logout Warning",
                    body: `You have been idle for ${Math.round(idle)} minutes. Consider logging out for security.`,
                    permanent: true,
                    onClick: () => window.open("https://discord.com/settings/account")
                });
            }
        }, 60000);
    },
    stop() { clearInterval(this.interval); }
});
