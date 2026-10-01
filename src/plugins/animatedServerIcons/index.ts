import definePlugin from "@utils/types";
export default definePlugin({
    name: "AnimatedServerIcons",
    description: "Makes all server icons animated on hover even if they are static",
    authors: [{ name: "DemCord", id: 0n }],
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-animated-icons";
        this.styleEl.textContent = `
            [class*="guildIcon"]:hover { transform: scale(1.15) rotate(5deg) !important; transition: transform 0.2s ease !important; }
            [class*="guildIcon"] { transition: transform 0.2s ease !important; border-radius: 30% !important; }
            [class*="guildIcon"]:hover { border-radius: 50% !important; }
        `;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
