import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Hide offscreen elements to reduce GPU load", default: true },
    margin: { type: OptionType.NUMBER, description: "Margin in px before hiding", default: 200 }
});
export default definePlugin({
    name: "OffscreenElementKiller",
    description: "Hides DOM elements not visible on screen to reduce GPU and RAM usage",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    observer: null as IntersectionObserver | null,
    start() {
        if (!settings.store.enabled) return;
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const el = entry.target as HTMLElement;
                if (!entry.isIntersecting) el.style.contentVisibility = "hidden";
                else el.style.contentVisibility = "visible";
            });
        }, { rootMargin: `${settings.store.margin}px` });
        document.querySelectorAll("[class*='message']").forEach(el => (this as any).observer?.observe(el));
    },
    stop() { this.observer?.disconnect(); }
});
