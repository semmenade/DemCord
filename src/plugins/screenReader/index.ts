import definePlugin from "@utils/types";
export default definePlugin({
    name: "ScreenReaderOptimizer",
    description: "Optimizes Discord for screen reader accessibility",
    authors: [{ name: "DemCord", id: 0n }],
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-screenreader";
        this.styleEl.textContent = `
            [aria-label] { outline: none !important; }
            [class*="message"]:focus { outline: 2px solid #a855f7 !important; }
            [class*="button"]:focus { outline: 2px solid #a855f7 !important; border-radius: 4px; }
        `;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
