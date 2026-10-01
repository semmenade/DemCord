import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    count: { type: OptionType.NUMBER, description: "Number of particles", default: 50 },
    color: { type: OptionType.STRING, description: "Particle color hex", default: "#a855f7" }
});
export default definePlugin({
    name: "SnowEffect",
    description: "Animated particle snow or rain effect overlay on Discord",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    container: null as HTMLDivElement | null,
    start() {
        const div = document.createElement("div");
        div.id = "demcord-snow";
        div.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;overflow:hidden;";
        for (let i = 0; i < settings.store.count; i++) {
            const p = document.createElement("div");
            const size = Math.random() * 4 + 2;
            const dur = Math.random() * 5 + 3;
            const delay = Math.random() * 5;
            p.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50%;background:${settings.store.color};left:${Math.random() * 100}%;top:-10px;opacity:${Math.random() * 0.6 + 0.2};animation:demcord-snow-fall ${dur}s linear ${delay}s infinite;`;
            div.appendChild(p);
        }
        const style = document.createElement("style");
        style.id = "demcord-snow-style";
        style.textContent = `@keyframes demcord-snow-fall { 0%{transform:translateY(-10px)} 100%{transform:translateY(110vh)} }`;
        document.head.appendChild(style);
        document.body.appendChild(div);
        this.container = div;
    },
    stop() { this.container?.remove(); document.getElementById("demcord-snow-style")?.remove(); }
});
