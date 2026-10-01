import definePlugin from "@utils/types";
export default definePlugin({
    name: "GifPause",
    description: "Auto-pauses GIFs when Discord is not focused to save CPU",
    authors: [{ name: "DemCord", id: 0n }],
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-gifpause";
        document.head.appendChild(this.styleEl);
        window.addEventListener("blur", () => {
            if (this.styleEl) this.styleEl.textContent = "img[src*='.gif'], video { animation-play-state: paused !important; }";
        });
        window.addEventListener("focus", () => {
            if (this.styleEl) this.styleEl.textContent = "";
        });
    },
    stop() { this.styleEl?.remove(); }
});
