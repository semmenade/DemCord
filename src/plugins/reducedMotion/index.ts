import definePlugin from "@utils/types";
export default definePlugin({
    name: "ReducedMotion",
    description: "Disables all Discord animations for a cleaner faster experience",
    authors: [{ name: "DemCord", id: 0n }],
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-reduced-motion";
        this.styleEl.textContent = `*, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; scroll-behavior: auto !important; }`;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
