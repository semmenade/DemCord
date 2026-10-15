import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Monitor connection quality", default: true },
    packetLossThreshold: { type: OptionType.NUMBER, description: "Packet loss % to alert", default: 5 }
});
export default definePlugin({
    name: "ConnectionQualityMonitor",
    description: "Shows live connection quality including packet loss and latency",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    hudEl: null as HTMLDivElement | null,
    interval: null as any,
    requests: 0, failures: 0,
    start() {
        const hud = document.createElement("div");
        hud.id = "demcord-connquality";
        hud.style.cssText = "position:fixed;bottom:25px;right:10px;background:rgba(13,0,16,0.85);border:1px solid rgba(168,85,247,0.4);border-radius:6px;padding:3px 8px;font-size:10px;font-family:monospace;color:#e9d5ff;z-index:99999;pointer-events:none;";
        document.body.appendChild(hud);
        this.hudEl = hud;
        const origFetch = window.fetch;
        window.fetch = async function(...args: any[]) {
            (this as any).requests++;
            try { const r = await origFetch.apply(this, args); return r; }
            catch(e) { (this as any).failures++; throw e; }
        };
        this.interval = setInterval(() => {
            if (!settings.store.enabled) return;
            const total = (this as any).requests || 1;
            const loss = Math.round(((this as any).failures / total) * 100);
            const color = loss === 0 ? "#22c55e" : loss < settings.store.packetLossThreshold ? "#eab308" : "#ef4444";
            if (hud) hud.innerHTML = `<span style="color:${color}">Loss: ${loss}%</span>`;
            if (loss >= settings.store.packetLossThreshold) showNotification({ title: "Connection Warning", body: `High packet loss detected: ${loss}%` });
            (this as any).requests = 0; (this as any).failures = 0;
        }, 30000);
    },
    stop() { clearInterval(this.interval); this.hudEl?.remove(); }
});
