import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Enable resolution scaler", default: false },
    quality: {
        type: OptionType.SELECT,
        description: "Image quality preset",
        options: [
            { label: "Auto (based on RAM)", value: "auto", default: true },
            { label: "4K / High", value: "high" },
            { label: "1080p / Medium", value: "medium" },
            { label: "720p / Low", value: "low" }
        ]
    },
    ramThreshold: { type: OptionType.NUMBER, description: "RAM threshold in MB to trigger quality reduction", default: 600 }
});

export default definePlugin({
    name: "ResolutionScaler",
    description: "Automatically reduces image quality when VRAM or RAM usage is high then restores when idle",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    interval: null as any,

    getStyle(quality: string) {
        switch(quality) {
            case "low": return `img, video { image-rendering: pixelated !important; max-width: 480px !important; } [class*="embedMedia"] { max-height: 200px !important; }`;
            case "medium": return `img, video { image-rendering: auto !important; max-width: 960px !important; } [class*="embedMedia"] { max-height: 350px !important; }`;
            case "high": return `img, video { image-rendering: high-quality !important; }`;
            default: return "";
        }
    },

    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-resolution";
        document.head.appendChild(this.styleEl);

        if (settings.store.quality !== "auto") {
            if (this.styleEl) this.styleEl.textContent = this.getStyle(settings.store.quality);
            return;
        }

        this.interval = setInterval(() => {
            if (!settings.store.enabled || !(performance as any).memory) return;
            const mb = Math.round((performance as any).memory.usedJSHeapSize / 1048576);
            let quality = "high";
            if (mb >= settings.store.ramThreshold) quality = "low";
            else if (mb >= settings.store.ramThreshold * 0.75) quality = "medium";
            if (this.styleEl) this.styleEl.textContent = this.getStyle(quality);
        }, 15000);
    },

    stop() {
        clearInterval(this.interval);
        this.styleEl?.remove();
    }
});
