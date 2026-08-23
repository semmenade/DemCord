import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    favorites: { type: OptionType.STRING, description: "Favorite emojis comma separated", default: "thumbsup,heart,laughing,fire,100,clap,eyes,sob,joy,skull" }
});

export default definePlugin({
    name: "ReactionPicker",
    description: "Custom emoji grid that pops up with your most used reactions for one-click reacting",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    _handler: null as any,

    start() {
        this._handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const msg = target.closest?.("[class*='message']");
            if (!msg || !e.altKey) return;
            const existing = document.getElementById("demcord-reaction-picker");
            if (existing) { existing.remove(); return; }
            const picker = document.createElement("div");
            picker.id = "demcord-reaction-picker";
            const rect = msg.getBoundingClientRect();
            picker.style.cssText = `position:fixed;top:${rect.top - 60}px;left:${rect.left}px;background:rgba(13,0,16,0.95);border:1px solid rgba(168,85,247,0.4);border-radius:12px;padding:8px;z-index:99999;display:flex;gap:6px;flex-wrap:wrap;max-width:280px;backdrop-filter:blur(12px);`;
            const emojis = settings.store.favorites.split(",").map((e: string) => e.trim()).filter(Boolean);
            emojis.forEach(emoji => {
                const btn = document.createElement("button");
                btn.textContent = `:${emoji}:`;
                btn.style.cssText = "background:rgba(168,85,247,0.15);border:1px solid rgba(168,85,247,0.2);border-radius:6px;padding:4px 8px;color:#e9d5ff;cursor:pointer;font-size:12px;";
                btn.onmouseenter = () => btn.style.background = "rgba(168,85,247,0.35)";
                btn.onmouseleave = () => btn.style.background = "rgba(168,85,247,0.15)";
                btn.onclick = () => { picker.remove(); };
                picker.appendChild(btn);
            });
            document.body.appendChild(picker);
            document.addEventListener("click", () => picker.remove(), { once: true });
        };
        document.addEventListener("click", this._handler);
    },

    stop() {
        document.removeEventListener("click", this._handler);
        document.getElementById("demcord-reaction-picker")?.remove();
    },

    commands: [{
        name: "setfavorites",
        description: "Set your favorite reaction emojis",
        options: [{ name: "emojis", description: "Emoji names comma separated e.g. fire,heart,100", type: 3, required: true }],
        execute(opts: any[]) {
            const emojis = opts.find((o: any) => o.name === "emojis")?.value;
            settings.store.favorites = emojis;
            return { content: `Favorite reactions updated: ${emojis}` };
        }
    }]
});

