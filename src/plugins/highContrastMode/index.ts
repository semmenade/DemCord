import definePlugin from "@utils/types";
export default definePlugin({
    name: "HighContrastMode",
    description: "High contrast mode for better accessibility and visibility",
    authors: [{ name: "DemCord", id: 0n }],
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-highcontrast";
        this.styleEl.textContent = `
            :root { --text-normal: #ffffff !important; --text-muted: #cccccc !important; --background-primary: #000000 !important; --background-secondary: #111111 !important; }
            [class*="message"]:hover { background: rgba(255,255,255,0.1) !important; }
            a { color: #00ffff !important; }
        `;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
