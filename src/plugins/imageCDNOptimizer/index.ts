import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    maxSize: { type: OptionType.NUMBER, description: "Max image size in px (reduces VRAM)", default: 512 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable CDN optimization", default: true }
});
export default definePlugin({
    name: "ImageCDNOptimizer",
    description: "Optimizes Discord CDN image requests to reduce bandwidth and VRAM usage",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    observer: null as MutationObserver | null,
    start() {
        this.observer = new MutationObserver(() => {
            if (!settings.store.enabled) return;
            document.querySelectorAll("img[src*='cdn.discordapp.com']").forEach((img: any) => {
                if (img.dataset.cdnOptimized) return;
                const src = img.src;
                if (src.includes("?size=") || src.includes("&size=")) {
                    img.src = src.replace(/[?&]size=\d+/, `?size=${settings.store.maxSize}`);
                } else if (!src.includes("?")) {
                    img.src = `${src}?size=${settings.store.maxSize}`;
                }
                img.dataset.cdnOptimized = "1";
            });
        });
        this.observer.observe(document.body, { childList: true, subtree: true });
    },
    stop() { this.observer?.disconnect(); }
});
