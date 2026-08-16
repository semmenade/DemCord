import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "SessionManager",
    description: "Monitors all active Discord sessions and alerts on new device logins",
    authors: [{ name: "DemCord", id: 0n }],
    knownSessions: new Set<string>(),
    interval: null as any,
    start() {
        this.interval = setInterval(async () => {
            try {
                const res = await fetch("https://discord.com/api/v9/auth/sessions");
                if (!res.ok) return;
                const data = await res.json();
                const sessions = data.user_sessions || [];
                for (const session of sessions) {
                    const id = session.id_hash;
                    if (id && !(this as any).knownSessions.has(id)) {
                        if ((this as any).knownSessions.size > 0) {
                            showNotification({
                                title: "New Login Detected",
                                body: `New session: ${session.client_info?.os || "Unknown device"}`,
                                color: "#f38ba8",
                                permanent: true,
                                onClick: () => window.open("https://discord.com/settings/sessions")
                            });
                        }
                        (this as any).knownSessions.add(id);
                    }
                }
            } catch {}
        }, 300000);
    },
    stop() { clearInterval(this.interval); }
});
