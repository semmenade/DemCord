import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "ScreenshotTool",
    description: "Built-in screenshot tool with one hotkey Ctrl+Shift+S",
    authors: [{ name: "DemCord", id: 0n }],
    _handler: null as any,
    start() {
        this._handler = (e: KeyboardEvent) => {
            if (!e.ctrlKey || !e.shiftKey || e.key !== "S") return;
            const canvas = document.createElement("canvas");
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            canvas.toBlob(blob => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `screenshot-${Date.now()}.png`;
                a.click();
                showNotification({ title: "Screenshot", body: "Screenshot saved" });
            });
        };
        document.addEventListener("keydown", this._handler);
    },
    stop() { document.removeEventListener("keydown", this._handler); }
});
