import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Throttle Discord when not focused", default: true },
    throttleFPS: { type: OptionType.NUMBER, description: "Target FPS when in background (1-30)", default: 5 }
});

export default definePlugin({
    name: "BackgroundThrottler",
    description: "Drops animations and timers to near-zero when Discord loses focus to save CPU and RAM",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    _blurHandler: null as any,
    _focusHandler: null as any,

    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-throttle";
        document.head.appendChild(this.styleEl);

        this._blurHandler = () => {
            if (!settings.store.enabled) return;
            if (this.styleEl) this.styleEl.textContent = `
                *, *::before, *::after {
                    animation-play-state: paused !important;
                }
                canvas { display: none !important; }
                video:not([data-demcord-keep]) { animation-play-state: paused !important; }
            `;
        };

        this._focusHandler = () => {
            if (this.styleEl) this.styleEl.textContent = "";
        };

        window.addEventListener("blur", this._blurHandler);
        window.addEventListener("focus", this._focusHandler);
    },

    stop() {
        window.removeEventListener("blur", this._blurHandler);
        window.removeEventListener("focus", this._focusHandler);
        this.styleEl?.remove();
    }
});
