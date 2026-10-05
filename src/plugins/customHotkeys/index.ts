import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    hotkeys: { type: OptionType.STRING, description: "Custom hotkeys JSON", default: "[]", hidden: true }
});
function getHotkeys() { try { return JSON.parse(settings.store.hotkeys); } catch { return []; } }
function saveHotkeys(h: any[]) { settings.store.hotkeys = JSON.stringify(h); }
export default definePlugin({
    name: "CustomHotkeys",
    description: "Remap any Discord keyboard shortcut to whatever you want",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    _handler: null as any,
    start() {
        this._handler = (e: KeyboardEvent) => {
            const hotkeys = getHotkeys();
            const pressed = `${e.ctrlKey?"ctrl+":""}${e.shiftKey?"shift+":""}${e.altKey?"alt+":""}${e.key.toLowerCase()}`;
            const hk = hotkeys.find((h: any) => h.key === pressed);
            if (!hk) return;
            e.preventDefault();
            e.stopPropagation();
            console.log(`[CustomHotkeys] Triggered: ${hk.action}`);
        };
        document.addEventListener("keydown", this._handler, true);
    },
    stop() { document.removeEventListener("keydown", this._handler, true); },
    commands: [
        { name: "hotkey-add", description: "Add a custom hotkey", options: [{ name: "key", description: "Key combo e.g. ctrl+shift+m", type: 3, required: true }, { name: "action", description: "Action to perform", type: 3, required: true }], execute(opts: any[]) { const key = opts.find((o: any) => o.name === "key")?.value; const action = opts.find((o: any) => o.name === "action")?.value; const h = getHotkeys(); h.push({ key, action }); saveHotkeys(h); return { content: `Hotkey added: ${key} -> ${action}` }; } },
        { name: "hotkey-list", description: "List all custom hotkeys", execute() { const h = getHotkeys(); if (!h.length) return { content: "No custom hotkeys set" }; return { content: `**Custom Hotkeys:**\n${h.map((hk: any) => `${hk.key} -> ${hk.action}`).join("\n")}` }; } }
    ]
});
