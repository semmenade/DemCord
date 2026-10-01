import definePlugin from "@utils/types";
export default definePlugin({
    name: "AprilFools",
    description: "Random pranks on friends like fake message glitches on April 1st",
    authors: [{ name: "DemCord", id: 0n }],
    styleEl: null as HTMLStyleElement | null,
    start() {
        const date = new Date();
        if (date.getMonth() !== 3 || date.getDate() !== 1) return;
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-aprilfools";
        this.styleEl.textContent = `@keyframes glitch { 0%{transform:translate(0)} 20%{transform:translate(-2px,2px)} 40%{transform:translate(2px,-2px)} 60%{transform:translate(0)} } [class*="message"]:nth-child(5n) { animation: glitch 0.3s infinite; }`;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); }
});
