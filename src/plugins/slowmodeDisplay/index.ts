import definePlugin from "@utils/types";
export default definePlugin({
    name: "SlowmodeDisplay",
    description: "Shows the current slowmode timer prominently in the chat bar",
    authors: [{ name: "DemCord", id: 0n }],
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-slowmode";
        this.styleEl.textContent = `[class*="slowModeMessage"] { color: #a855f7 !important; font-weight: 600 !important; }`;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
