import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    budgetMs: { type: OptionType.NUMBER, description: "Max render time per frame in ms", default: 16 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable render budget limiter", default: true }
});
export default definePlugin({
    name: "RenderBudgetLimiter",
    description: "Caps render time per frame to maintain smooth 60fps performance",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    animFrame: null as number | null,
    start() {
        let lastFrame = performance.now();
        const check = () => {
            const now = performance.now();
            const delta = now - lastFrame;
            if (delta > settings.store.budgetMs * 3 && settings.store.enabled) {
                document.dispatchEvent(new CustomEvent("demcord-render-lag", { detail: { delta } }));
            }
            lastFrame = now;
            (this as any).animFrame = requestAnimationFrame(check);
        };
        (this as any).animFrame = requestAnimationFrame(check);
    },
    stop() { if (this.animFrame) cancelAnimationFrame(this.animFrame); }
});
