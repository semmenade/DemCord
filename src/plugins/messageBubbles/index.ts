import definePlugin from "@utils/types";
export default definePlugin({
    name: "MessageBubbles",
    description: "iMessage style speech bubble layout for messages",
    authors: [{ name: "DemCord", id: 0n }],
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-bubbles";
        this.styleEl.textContent = `
            [class*="message"] [class*="contents"] { background: rgba(168,85,247,0.15); border-radius: 18px; padding: 8px 14px !important; display: inline-block; max-width: 80%; margin: 2px 0; border: 1px solid rgba(168,85,247,0.2); }
            [class*="message"]:hover [class*="contents"] { background: rgba(168,85,247,0.25); }
        `;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
