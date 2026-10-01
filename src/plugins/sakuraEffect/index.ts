import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    count: { type: OptionType.NUMBER, description: "Number of petals", default: 30 },
    color: { type: OptionType.STRING, description: "Petal color hex", default: "#c084fc" }
});
export default definePlugin({
    name: "SakuraEffect",
    description: "Animated falling sakura petal effect overlay on Discord",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    container: null as HTMLDivElement | null,
    start() {
        const div = document.createElement("div");
        div.id = "demcord-sakura";
        div.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9998;overflow:hidden;";
        for (let i = 0; i < settings.store.count; i++) {
            const p = document.createElement("div");
            const size = Math.random() * 10 + 6;
            const dur = Math.random() * 6 + 4;
            const delay = Math.random() * 6;
            p.style.cssText = `position:absolute;width:${size}px;height:${size}px;border-radius:50% 50% 50% 0;background:${settings.store.color};left:${Math.random() * 100}%;top:-20px;opacity:${Math.random() * 0.5 + 0.3};animation:demcord-sakura-fall ${dur}s ease-in ${delay}s infinite;`;
            div.appendChild(p);
        }
        const style = document.createElement("style");
        style.id = "demcord-sakura-style";
        style.textContent = `@keyframes demcord-sakura-fall { 0%{transform:translateY(-20px) rotate(0deg)} 100%{transform:translateY(110vh) rotate(360deg)} }`;
        document.head.appendChild(style);
        document.body.appendChild(div);
        this.container = div;
    },
    stop() { this.container?.remove(); document.getElementById("demcord-sakura-style")?.remove(); }
});
