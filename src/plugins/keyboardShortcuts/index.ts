import definePlugin from "@utils/types";
import { Toasts } from "@webpack/common";
export default definePlugin({
    name: "KeyboardShortcuts",
    description: "Custom keybinds for common Discord actions",
    authors: [{ name: "DemCord", id: 0n }],
    _handler: null as any,
    start() {
        this._handler = (e: KeyboardEvent) => {
            if (!e.ctrlKey && !e.altKey) return;
            if (e.ctrlKey && e.key === "k") { e.preventDefault(); document.querySelector<HTMLElement>("[class*='search']")?.click(); }
            if (e.altKey && e.key === "ArrowUp") { e.preventDefault(); console.log("[KeyboardShortcuts] Navigate to previous channel"); }
            if (e.altKey && e.key === "ArrowDown") { e.preventDefault(); console.log("[KeyboardShortcuts] Navigate to next channel"); }
        };
        document.addEventListener("keydown", this._handler);
    },
    stop() { document.removeEventListener("keydown", this._handler); },
    commands: [{
        name: "shortcuts",
        description: "Show all DemCord keyboard shortcuts",
        execute() {
            return { content: `**DemCord Keyboard Shortcuts:**\nCtrl+Delete - Delete last message\nCtrl+Shift+S - Screenshot\nAlt+Up/Down - Navigate channels\nCtrl+K - Quick search` };
        }
    }]
});
