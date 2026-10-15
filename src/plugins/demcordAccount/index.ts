import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";

const API_URL = "https://79.143.181.54:4000";

const settings = definePluginSettings({
    userId: { type: OptionType.STRING, description: "Your Discord User ID", default: "", hidden: true },
    role: { type: OptionType.STRING, description: "Your DemCord role", default: "user", hidden: true },
    dp: { type: OptionType.NUMBER, description: "Your DemCord Points balance", default: 0, hidden: true },
    registered: { type: OptionType.BOOLEAN, description: "Registered with DemCord servers", default: false, hidden: true },
    deviceId: { type: OptionType.STRING, description: "Device identifier", default: "", hidden: true }
});

function getDeviceId(): string {
    if (!settings.store.deviceId) {
        const id = `dc-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        settings.store.deviceId = id;
    }
    return settings.store.deviceId;
}

export default definePlugin({
    name: "DemCordAccount",
    description: "Links your Discord account to DemCord for roles, points, and ban enforcement",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    required: true,
    ws: null as WebSocket | null,

    async start() {
        await this.register();
        this.startHeartbeat();
    },

    async register() {
        try {
            const user = (window as any).DiscordNative?.remoteApp?.getCurrentUser?.();
            if (!user) {
                setTimeout(() => this.register(), 5000);
                return;
            }

            settings.store.userId = user.id;

            const res = await fetch(`${API_URL}/api/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    discordId: user.id,
                    username: user.username,
                    deviceId: getDeviceId(),
                    version: "2.6.0"
                })
            });

            const data = await res.json();

            if (data.banned) {
                this.showBanScreen(data.message);
                return;
            }

            if (data.success) {
                settings.store.role = data.user.role;
                settings.store.dp = data.user.dp;
                settings.store.registered = true;

                if (data.isNew) {
                    showNotification({ title: "Welcome to DemCord!", body: `You have been assigned the role: ${data.user.role}` });
                }

                console.log(`[DemCordAccount] Registered as ${data.user.username} with role: ${data.user.role}`);
            }
        } catch(e) {
            console.error("[DemCordAccount] Registration failed:", e);
        }
    },

    showBanScreen(message: string) {
        const existing = document.getElementById("demcord-ban-screen");
        if (existing) return;

        const overlay = document.createElement("div");
        overlay.id = "demcord-ban-screen";
        overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:#0d0010;z-index:999999;display:flex;align-items:center;justify-content:center;flex-direction:column;";
        overlay.innerHTML = `
            <div style="text-align:center;max-width:500px;padding:40px;">
                <div style="font-size:64px;margin-bottom:20px;">🚫</div>
                <h1 style="color:#ef4444;font-size:24px;font-weight:800;margin-bottom:12px;">Access Denied</h1>
                <p style="color:#fca5a5;font-size:16px;line-height:1.6;margin-bottom:24px;">${message}</p>
                <a href="https://discord.gg/cybernet" target="_blank" style="background:linear-gradient(135deg,#7b2fbe,#a855f7);color:white;padding:12px 24px;border-radius:10px;text-decoration:none;font-weight:700;">Request Appeal</a>
            </div>
        `;
        document.body.appendChild(overlay);

        // Block all interaction
        document.body.style.overflow = "hidden";
        document.body.style.pointerEvents = "none";
        overlay.style.pointerEvents = "all";
    },

    startHeartbeat() {
        try {
            const proto = API_URL.startsWith("https") ? "wss:" : "ws:";
            const wsUrl = `${proto}//${API_URL.replace(/https?:\/\//, "")}`;
            this.ws = new WebSocket(wsUrl);

            this.ws.onopen = () => {
                const beat = () => {
                    if (this.ws?.readyState === WebSocket.OPEN && settings.store.userId) {
                        this.ws.send(JSON.stringify({ type: "heartbeat", userId: settings.store.userId }));
                    }
                };
                beat();
                setInterval(beat, 60000);
            };

            this.ws.onmessage = (e) => {
                try {
                    const msg = JSON.parse(e.data);
                    if (msg.type === "ban") this.showBanScreen(msg.message);
                    if (msg.type === "role_update" && msg.userId === settings.store.userId) {
                        settings.store.role = msg.role;
                        showNotification({ title: "DemCord", body: `Your role has been updated to: ${msg.role}` });
                    }
                } catch {}
            };
        } catch(e) {
            console.error("[DemCordAccount] WebSocket failed:", e);
        }
    },

    stop() {
        this.ws?.close();
    },

    commands: [
        {
            name: "my-account",
            description: "Show your DemCord account info",
            execute() {
                if (!settings.store.registered) return { content: "Not registered with DemCord yet. Restart Discord to register." };
                return { content: `**Your DemCord Account:**\nDiscord ID: ${settings.store.userId}\nRole: ${settings.store.role}\nDP Balance: ${settings.store.dp.toLocaleString()} DP\nDevice: ${getDeviceId()}` };
            }
        }
    ]
});
