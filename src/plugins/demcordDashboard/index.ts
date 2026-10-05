import definePlugin from "@utils/types";
export default definePlugin({
    name: "DemCordDashboard",
    description: "All your stats plugins in one beautiful overlay panel",
    authors: [{ name: "DemCord", id: 0n }],
    panel: null as HTMLDivElement | null,
    _handler: null as any,
    start() {
        this._handler = (e: KeyboardEvent) => {
            if (!e.ctrlKey || !e.shiftKey || e.key !== "D") return;
            e.preventDefault();
            const existing = document.getElementById("demcord-dashboard");
            if (existing) { existing.remove(); return; }
            const panel = document.createElement("div");
            panel.id = "demcord-dashboard";
            panel.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(13,0,16,0.97);border:1px solid rgba(168,85,247,0.5);border-radius:16px;padding:24px;z-index:99999;min-width:400px;backdrop-filter:blur(20px);color:#e9d5ff;font-family:monospace;";
            const mem = (performance as any).memory;
            const ram = mem ? `${Math.round(mem.usedJSHeapSize/1048576)}MB / ${Math.round(mem.jsHeapSizeLimit/1048576)}MB` : "N/A";
            const pluginCount = Object.keys(DemCord.Plugins.plugins).length;
            const activePlugins = Object.values(DemCord.Plugins.plugins).filter((p: any) => p.started).length;
            panel.innerHTML = `
                <div style="font-size:16px;font-weight:700;color:#a855f7;margin-bottom:16px;">DemCord Dashboard</div>
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
                    <div style="background:rgba(168,85,247,0.1);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#9b72cf;">RAM USAGE</div><div style="font-size:18px;font-weight:700;">${ram}</div></div>
                    <div style="background:rgba(168,85,247,0.1);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#9b72cf;">PLUGINS</div><div style="font-size:18px;font-weight:700;">${activePlugins} / ${pluginCount}</div></div>
                    <div style="background:rgba(168,85,247,0.1);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#9b72cf;">SESSION TIME</div><div style="font-size:18px;font-weight:700;">${Math.floor(performance.now()/3600000)}h ${Math.floor((performance.now()%3600000)/60000)}m</div></div>
                    <div style="background:rgba(168,85,247,0.1);border-radius:8px;padding:12px;"><div style="font-size:11px;color:#9b72cf;">ONLINE</div><div style="font-size:18px;font-weight:700;">${navigator.onLine ? "Connected" : "Offline"}</div></div>
                </div>
                <div style="margin-top:12px;font-size:11px;color:#4b1080;text-align:center;">Press Ctrl+Shift+D to close</div>
            `;
            document.body.appendChild(panel);
            document.addEventListener("click", (ev) => { if (!panel.contains(ev.target as Node)) panel.remove(); }, { once: true });
        };
        document.addEventListener("keydown", this._handler);
    },
    stop() { document.removeEventListener("keydown", this._handler); document.getElementById("demcord-dashboard")?.remove(); }
});
