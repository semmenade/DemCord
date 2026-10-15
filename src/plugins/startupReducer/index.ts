import definePlugin from "@utils/types";
export default definePlugin({
    name: "StartupReducer",
    description: "Reduces Discord startup time by deferring non-essential operations",
    authors: [{ name: "DemCord", id: 0n }],
    styleEl: null as HTMLStyleElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-startup";
        this.styleEl.textContent = `*, *::before, *::after { animation-duration: 0.001ms !important; transition-duration: 0.001ms !important; }`;
        document.head.appendChild(this.styleEl);
        setTimeout(() => { this.styleEl?.remove(); }, 3000);
    },
    stop() { this.styleEl?.remove(); }
});
