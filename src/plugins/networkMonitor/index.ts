import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "NetworkMonitor",
    description: "Shows Discord network status and alerts on connection drops",
    authors: [{ name: "DemCord", id: 0n }],
    interval: null as any,
    wasOnline: true,
    start() {
        this.interval = setInterval(() => {
            const online = navigator.onLine;
            if ((this as any).wasOnline && !online) showNotification({ title: "NetworkMonitor", body: "Connection lost!" });
            else if (!(this as any).wasOnline && online) showNotification({ title: "NetworkMonitor", body: "Connection restored!" });
            (this as any).wasOnline = online;
        }, 5000);
    },
    stop() { clearInterval(this.interval); },
    commands: [{
        name: "network",
        description: "Show current network status",
        execute() {
            return { content: `Network: ${navigator.onLine ? "Online" : "Offline"} | Type: ${(navigator as any).connection?.effectiveType || "Unknown"}` };
        }
    }]
});
