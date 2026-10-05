import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Enable idle CPU limiter", default: true },
    idleSeconds: { type: OptionType.NUMBER, description: "Seconds of inactivity before limiting", default: 60 }
});

export default definePlugin({
    name: "IdleCPULimiter",
    description: "Reduces Discord CPU priority when you are not actively typing or scrolling",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,
    lastActivity: Date.now(),
    interval: null as any,
    _handler: null as any,
    limited: false,

    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-cpulimit";
        document.head.appendChild(this.styleEl);

        this._handler = () => {
            (this as any).lastActivity = Date.now();
            if ((this as any).limited) {
                (this as any).limited = false;
                if ((this as any).styleEl) (this as any).styleEl.textContent = "";
            }
        };

        document.addEventListener("mousemove", this._handler);
        document.addEventListener("keydown", this._handler);
        document.addEventListener("scroll", this._handler);

        this.interval = setInterval(() => {
            if (!settings.store.enabled || (this as any).limited) return;
            const idle = (Date.now() - (this as any).lastActivity) / 1000;
            if (idle >= settings.store.idleSeconds) {
                (this as any).limited = true;
                if ((this as any).styleEl) (this as any).styleEl.textContent = `
                    *, *::before, *::after {
                        animation-duration: 9999s !important;
                        transition-duration: 0.001ms !important;
                    }
                    [class*="gif"], img[src*=".gif"] {
                        animation-play-state: paused !important;
                    }
                `;
            }
        }, 10000);
    },

    stop() {
        clearInterval(this.interval);
        document.removeEventListener("mousemove", this._handler);
        document.removeEventListener("keydown", this._handler);
        document.removeEventListener("scroll", this._handler);
        this.styleEl?.remove();
    }
});
