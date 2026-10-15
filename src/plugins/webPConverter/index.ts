import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Force WebP for Discord CDN images", default: true },
    quality: { type: OptionType.NUMBER, description: "WebP quality 1-100", default: 80 }
});
export default definePlugin({
    name: "WebPConverter",
    description: "Forces Discord CDN to serve WebP images to reduce bandwidth and VRAM",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    observer: null as MutationObserver | null,
    start() {
        if (!settings.store.enabled) return;
        this.observer = new MutationObserver(() => {
            document.querySelectorAll("img[src*='cdn.discordapp.com']").forEach((img: any) => {
                if (img.dataset.webpConverted) return;
                let src = img.src;
                if (!src.includes("format=webp")) src += (src.includes("?") ? "&" : "?") + `format=webp&quality=${settings.store.quality}`;
                img.src = src;
                img.dataset.webpConverted = "1";
            });
        });
        this.observer.observe(document.body, { childList: true, subtree: true });
    },
    stop() { this.observer?.disconnect(); }
});
