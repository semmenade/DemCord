import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    effect: { type: OptionType.SELECT, description: "Send effect style", options: [{ label: "Particles", value: "particles", default: true }, { label: "Ripple", value: "ripple" }, { label: "Flash", value: "flash" }] },
    color: { type: OptionType.STRING, description: "Effect color hex", default: "#a855f7" }
});
export default definePlugin({
    name: "MessageSendEffect",
    description: "Animated particles or effects when you send a message",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-send-effect";
        this.styleEl.textContent = `@keyframes demcord-particle { 0%{transform:translate(0,0) scale(1);opacity:1} 100%{transform:translate(var(--dx),var(--dy)) scale(0);opacity:0} }`;
        document.head.appendChild(this.styleEl);
        document.addEventListener("keydown", this._handler = (e: KeyboardEvent) => {
            if (e.key !== "Enter" || e.shiftKey) return;
            const ta = document.querySelector("[class*='textArea'] [contenteditable]");
            if (!ta || !(ta as any).textContent?.trim()) return;
            this.spawnEffect();
        });
    },
    spawnEffect() {
        const btn = document.querySelector("[class*='buttonContainer']");
        if (!btn) return;
        const rect = btn.getBoundingClientRect();
        for (let i = 0; i < 8; i++) {
            const p = document.createElement("div");
            const dx = (Math.random() - 0.5) * 60;
            const dy = (Math.random() - 0.5) * 60;
            p.style.cssText = `position:fixed;width:6px;height:6px;border-radius:50%;background:${settings.store.color};left:${rect.left + rect.width/2}px;top:${rect.top + rect.height/2}px;pointer-events:none;z-index:99999;--dx:${dx}px;--dy:${dy}px;animation:demcord-particle 0.5s ease-out forwards;`;
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 500);
        }
    },
    stop() {
        document.removeEventListener("keydown", this._handler);
        this.styleEl?.remove();
    }
});
