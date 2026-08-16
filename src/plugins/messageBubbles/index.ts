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
            [class*="messageContent"] {
                background: rgba(168,85,247,0.12) !important;
                border-radius: 0 14px 14px 14px !important;
                padding: 6px 12px !important;
                display: inline-block !important;
                max-width: 85% !important;
                border: 1px solid rgba(168,85,247,0.15) !important;
                margin-top: 2px !important;
            }
            [class*="messageContent"]:hover {
                background: rgba(168,85,247,0.2) !important;
            }
        `;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
