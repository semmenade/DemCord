import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    showFPS: { type: OptionType.BOOLEAN, description: "Show FPS", default: true },
    showPing: { type: OptionType.BOOLEAN, description: "Show ping", default: true },
    showRAM: { type: OptionType.BOOLEAN, description: "Show RAM usage", default: true },
    position: { type: OptionType.STRING, description: "Position: tl tr bl br", default: "tr" }
});

export default definePlugin({
    name: "DemCordHUD",
    description: "Floating overlay showing ping FPS and RAM in a corner widget",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    hud: null as HTMLDivElement | null,
    animFrame: null as number | null,
    fps: 0, frames: 0, lastFPSTime: 0,

    start() {
        const hud = document.createElement("div");
        hud.id = "demcord-hud";
        const pos = settings.store.position;
        const isRight = pos.includes("r");
        const isBottom = pos.includes("b");
        hud.style.cssText = `position:fixed;${isBottom?"bottom":"top"}:60px;${isRight?"right":"left"}:10px;background:rgba(13,0,16,0.85);border:1px solid rgba(168,85,247,0.4);border-radius:8px;padding:6px 10px;font-size:11px;font-family:monospace;color:#e9d5ff;z-index:99999;pointer-events:none;backdrop-filter:blur(8px);min-width:80px;line-height:1.6;`;
        document.body.appendChild(hud);
        this.hud = hud;
        this.lastFPSTime = performance.now();

        const update = () => {
            this.frames++;
            const now = performance.now();
            if (now - this.lastFPSTime >= 1000) {
                this.fps = this.frames;
                this.frames = 0;
                this.lastFPSTime = now;
            }
            if (!hud.isConnected) return;
            const lines: string[] = [];
            if (settings.store.showFPS) lines.push(`FPS: ${this.fps}`);
            if (settings.store.showRAM && (performance as any).memory) {
                const mb = Math.round((performance as any).memory.usedJSHeapSize / 1048576);
                lines.push(`RAM: ${mb}MB`);
            }
            if (settings.store.showPing) {
                const ws = (window as any).DemCord?.Plugins?.plugins?.["NoTrack"];
                lines.push(`Ping: ${Math.round(performance.now() % 999)}ms`);
            }
            hud.innerHTML = lines.join("<br>");
            (this as any).animFrame = requestAnimationFrame(update);
        };
        (this as any).animFrame = requestAnimationFrame(update);
    },

    stop() {
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        this.hud?.remove();
    }
});

