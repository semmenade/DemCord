import definePlugin from "@utils/types";
export default definePlugin({
    name: "DyslexiaFont",
    description: "Switches Discord to OpenDyslexic font for better readability",
    authors: [{ name: "DemCord", id: 0n }],
    styleEl: null as HTMLStyleElement | null,
    linkEl: null as HTMLLinkElement | null,
    start() {
        this.linkEl = document.createElement("link");
        this.linkEl.rel = "stylesheet";
        this.linkEl.href = "https://fonts.cdnfonts.com/css/opendyslexic";
        document.head.appendChild(this.linkEl);
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-dyslexia";
        this.styleEl.textContent = `* { font-family: "OpenDyslexic", sans-serif !important; }`;
        document.head.appendChild(this.styleEl);
    },
    stop() { this.styleEl?.remove(); this.linkEl?.remove(); }
});
