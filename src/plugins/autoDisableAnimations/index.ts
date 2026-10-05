import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";

const settings = definePluginSettings({
    fpsThreshold: { type: OptionType.NUMBER, description: "FPS threshold to disable animations", default: 30 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable auto animation disabler", default: true }
});

export default definePlugin({
    name: "AutoDisableAnimations",
    description: "Automatically disables all CSS animations when FPS drops below threshold",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    animFrame: null as number | null,
    fps: 60, frames: 0, lastTime: 0,
    animationsDisabled: false,

    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-autoanim";
        document.head.appendChild(this.styleEl);
        this.lastTime = performance.now();

        const tick = () => {
            this.frames++;
            const now = performance.now();
            if (now - this.lastTime >= 1000) {
                this.fps = this.frames;
                this.frames = 0;
                this.lastTime = now;
                if (settings.store.enabled) {
                    if (this.fps < settings.store.fpsThreshold && !this.animationsDisabled) {
                        this.animationsDisabled = true;
                        if (this.styleEl) this.styleEl.textContent = `*, *::before, *::after { animation: none !important; transition: none !important; }`;
                        showNotification({ title: "AutoDisableAnimations", body: `FPS dropped to ${this.fps} - animations disabled` });
                    } else if (this.fps >= settings.store.fpsThreshold + 10 && this.animationsDisabled) {
                        this.animationsDisabled = false;
                        if (this.styleEl) this.styleEl.textContent = "";
                    }
                }
            }
            (this as any).animFrame = requestAnimationFrame(tick);
        };
        (this as any).animFrame = requestAnimationFrame(tick);
    },

    stop() {
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        this.styleEl?.remove();
    }
});
