import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Show ping in HUD", default: true },
    warnThreshold: { type: OptionType.NUMBER, description: "Ping threshold to warn (ms)", default: 200 }
});
export default definePlugin({
    name: "NetworkPingMonitor",
    description: "Monitors your ping to Discord gateway and shows it in HUD",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    ping: 0,
    interval: null as any,
    hudEl: null as HTMLDivElement | null,
    start() {
        const hud = document.createElement("div");
        hud.id = "demcord-ping";
        hud.style.cssText = "position:fixed;bottom:40px;right:10px;background:rgba(13,0,16,0.85);border:1px solid rgba(168,85,247,0.4);border-radius:6px;padding:3px 8px;font-size:10px;font-family:monospace;color:#e9d5ff;z-index:99999;pointer-events:none;";
        document.body.appendChild(hud);
        this.hudEl = hud;
        this.interval = setInterval(async () => {
            if (!settings.store.enabled) return;
            const start = performance.now();
            try {
                await fetch("https://discord.com/api/v9/gateway", { method: "HEAD" });
                const ping = Math.round(performance.now() - start);
                (this as any).ping = ping;
                const color = ping < 100 ? "#22c55e" : ping < settings.store.warnThreshold ? "#eab308" : "#ef4444";
                if (hud) hud.innerHTML = `<span style="color:${color}">${ping}ms</span>`;
            } catch {}
        }, 5000);
    },
    stop() { clearInterval(this.interval); this.hudEl?.remove(); }
});
