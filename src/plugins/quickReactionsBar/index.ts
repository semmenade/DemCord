import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    emojis: { type: OptionType.STRING, description: "Quick reaction emojis comma separated", default: "thumbsup,heart,laughing,fire,100" }
});
export default definePlugin({
    name: "QuickReactionsBar",
    description: "Floating reaction bar that follows your cursor near messages",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    bar: null as HTMLDivElement | null,
    start() {
        const bar = document.createElement("div");
        bar.id = "demcord-quick-react";
        bar.style.cssText = "display:none;position:fixed;background:rgba(13,0,16,0.95);border:1px solid rgba(168,85,247,0.4);border-radius:20px;padding:4px 8px;z-index:99999;gap:4px;backdrop-filter:blur(12px);";
        settings.store.emojis.split(",").forEach(e => {
            const btn = document.createElement("button");
            btn.textContent = `:${e.trim()}:`;
            btn.style.cssText = "background:none;border:none;color:#e9d5ff;cursor:pointer;font-size:12px;padding:2px 4px;border-radius:4px;";
            btn.onmouseenter = () => btn.style.background = "rgba(168,85,247,0.2)";
            btn.onmouseleave = () => btn.style.background = "none";
            bar.appendChild(btn);
        });
        document.body.appendChild(bar);
        this.bar = bar;
        document.addEventListener("mouseover", this._handler = (e: MouseEvent) => {
            const msg = (e.target as HTMLElement).closest("[class*='message']");
            if (!msg) { bar.style.display = "none"; return; }
            const rect = msg.getBoundingClientRect();
            bar.style.cssText += `display:flex;top:${rect.top - 36}px;left:${rect.right - 200}px;`;
        });
    },
    stop() {
        document.removeEventListener("mouseover", this._handler);
        this.bar?.remove();
    }
});
