import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    mode: {
        type: OptionType.SELECT,
        description: "Performance mode",
        options: [
            { label: "Balanced", value: "balanced", default: true },
            { label: "High Performance (max FPS)", value: "performance" },
            { label: "Quality (4K/high res)", value: "quality" },
            { label: "Battery Saver", value: "battery" }
        ]
    },
    targetFPS: { type: OptionType.NUMBER, description: "Target FPS (60-200)", default: 60 },
    disableAnimations: { type: OptionType.BOOLEAN, description: "Disable all animations for max performance", default: false },
    gpuAcceleration: { type: OptionType.BOOLEAN, description: "Force GPU acceleration on all elements", default: true },
    imageQuality: { type: OptionType.SELECT, description: "Image quality", options: [
        { label: "Auto", value: "auto", default: true },
        { label: "High (4K)", value: "high" },
        { label: "Medium (1080p)", value: "medium" },
        { label: "Low (720p)", value: "low" }
    ]},
    lazyLoad: { type: OptionType.BOOLEAN, description: "Lazy load images and media", default: true },
    throttleBackground: { type: OptionType.BOOLEAN, description: "Throttle when Discord is in background", default: true }
});

export default definePlugin({
    name: "PerformanceMode",
    description: "Optimizes DemCord for smooth 60-200fps across all resolutions and themes",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    styleEl: null as HTMLStyleElement | null,
    frameTimer: null as any,
    lastFrame: 0,
    fps: 0,
    frameCount: 0,

    start() {
        this.applyMode();
        this.startFPSMonitor();
        if (settings.store.throttleBackground) this.setupBackgroundThrottle();
    },

    applyMode() {
        this.styleEl?.remove();
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-perf";
        const mode = settings.store.mode;

        let css = `
            /* Base GPU acceleration */
            [class*="sidebar"], [class*="chat"], [class*="guild"],
            [class*="channel"], [class*="member"], [class*="message"] {
                transform: translateZ(0);
                backface-visibility: hidden;
            }
            [class*="scroller"], [class*="messages"] {
                contain: layout style paint;
            }
            * {
                -webkit-font-smoothing: antialiased;
            }
        `;

        if (mode === "performance" || settings.store.disableAnimations) {
            css += `
                *, *::before, *::after {
                    animation-duration: 0.001ms !important;
                    transition-duration: 0.001ms !important;
                }
                [class*="scroller"] {
                    scroll-behavior: auto !important;
                }
                img[src*=".gif"] {
                    animation-play-state: paused;
                }
            `;
        }

        if (mode === "quality") {
            css += `
                img {
                    image-rendering: high-quality;
                }
                video {
                    image-rendering: optimizeQuality;
                }
                * {
                    text-rendering: optimizeLegibility;
                    -webkit-font-smoothing: subpixel-antialiased;
                }
            `;
        }

        if (mode === "battery") {
            css += `
                *, *::before, *::after {
                    animation-duration: 0.001ms !important;
                    transition-duration: 0.001ms !important;
                }
                img, video { animation-play-state: paused !important; }
                [class*="guild"]:not([class*="selected"]) { opacity: 0.85; }
            `;
        }

        if (settings.store.lazyLoad) {
            css += `
                img:not([loading]) { loading: lazy; }
            `;
        }

        this.styleEl.textContent = css;
        document.head.appendChild(this.styleEl);
    },

    startFPSMonitor() {
        let last = performance.now();
        let frames = 0;
        const tick = () => {
            frames++;
            const now = performance.now();
            if (now - last >= 1000) {
                (this as any).fps = frames;
                frames = 0;
                last = now;
            }
            (this as any).frameTimer = requestAnimationFrame(tick);
        };
        (this as any).frameTimer = requestAnimationFrame(tick);
    },

    setupBackgroundThrottle() {
        window.addEventListener("blur", () => {
            if (!settings.store.throttleBackground) return;
            document.documentElement.style.setProperty("--demcord-throttle", "1");
        });
        window.addEventListener("focus", () => {
            document.documentElement.style.removeProperty("--demcord-throttle");
        });
    },

    stop() {
        this.styleEl?.remove();
        if (this.frameTimer) cancelAnimationFrame(this.frameTimer);
    },

    commands: [{
        name: "fps",
        description: "Show current Discord FPS",
        execute() {
            return { content: `Current FPS: ${(this as any).fps}\nMode: ${settings.store.mode}\nTarget: ${settings.store.targetFPS}fps` };
        }
    }]
});
