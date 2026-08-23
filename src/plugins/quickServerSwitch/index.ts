import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    hotkey: { type: OptionType.STRING, description: "Hotkey to open server switcher", default: "ctrl+shift+s" }
});

export default definePlugin({
    name: "QuickServerSwitch",
    description: "Popup menu to jump between servers instantly with a hotkey",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    _handler: null as any,

    start() {
        this._handler = (e: KeyboardEvent) => {
            const hotkey = settings.store.hotkey.toLowerCase();
            const pressed = `${e.ctrlKey?"ctrl+":""}${e.shiftKey?"shift+":""}${e.altKey?"alt+":""}${e.key.toLowerCase()}`;
            if (pressed !== hotkey) return;
            e.preventDefault();
            const existing = document.getElementById("demcord-server-switcher");
            if (existing) { existing.remove(); return; }
            const overlay = document.createElement("div");
            overlay.id = "demcord-server-switcher";
            overlay.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(13,0,16,0.95);border:1px solid rgba(168,85,247,0.4);border-radius:12px;padding:16px;z-index:99999;min-width:300px;backdrop-filter:blur(16px);";
            const title = document.createElement("div");
            title.style.cssText = "color:#e9d5ff;font-size:14px;font-weight:700;margin-bottom:12px;";
            title.textContent = "Quick Server Switch";
            overlay.appendChild(title);
            const input = document.createElement("input");
            input.placeholder = "Search servers...";
            input.style.cssText = "width:100%;background:rgba(168,85,247,0.1);border:1px solid rgba(168,85,247,0.3);border-radius:8px;color:#e9d5ff;padding:8px 12px;font-size:13px;outline:none;box-sizing:border-box;";
            overlay.appendChild(input);
            const close = document.createElement("div");
            close.style.cssText = "color:#9b72cf;font-size:11px;margin-top:8px;text-align:center;cursor:pointer;";
            close.textContent = "Press Esc or click outside to close";
            overlay.appendChild(close);
            overlay.onclick = (ev) => ev.stopPropagation();
            document.body.appendChild(overlay);
            input.focus();
            const closeHandler = (ev: KeyboardEvent) => { if (ev.key === "Escape") { overlay.remove(); document.removeEventListener("keydown", closeHandler); } };
            document.addEventListener("keydown", closeHandler);
            document.addEventListener("click", () => overlay.remove(), { once: true });
        };
        document.addEventListener("keydown", this._handler);
    },

    stop() { document.removeEventListener("keydown", this._handler); document.getElementById("demcord-server-switcher")?.remove(); }
});

