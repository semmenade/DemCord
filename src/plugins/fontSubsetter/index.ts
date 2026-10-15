import definePlugin from "@utils/types";
export default definePlugin({
    name: "FontSubsetter",
    description: "Optimizes font loading by only loading characters actually used",
    authors: [{ name: "DemCord", id: 0n }],
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-fonts-opt";
        this.styleEl.textContent = `
            @font-face { font-display: swap; }
            * { font-display: swap !important; }
        `;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
