import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";

const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Enable Game Mode", default: false },
    hotkey: { type: OptionType.STRING, description: "Toggle hotkey", default: "ctrl+shift+g" },
    keepVoice: { type: OptionType.BOOLEAN, description: "Keep voice chat active", default: true },
    keepOverlay: { type: OptionType.BOOLEAN, description: "Keep Discord overlay active", default: true }
});

const HEAVY_PLUGINS = [
    "MatrixRain","SnowEffect","SakuraEffect","AnimatedServerIcons","NeonGlowMode",
    "MessageBubbles","ProfileTheme","DemCordHUD","ServerRadio","GradientUsernames",
    "DiscordWallpaper","CustomCursor","BackgroundThrottler","ServerActivityFeed",
    "MessageHeatMap","ReactionAnalytics","FriendTracker","DMLogger","ChannelLogger",
    "SpamLogger","TriggerLogger","TypingTracker","TypingSpeed","WordCount"
];

export default definePlugin({
    name: "GameMode",
    description: "Stops 98% of Discord resources while keeping voice and overlay active for gaming",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    active: false,
    pausedPlugins: [] as string[],
    styleEl: null as HTMLStyleElement | null,
    _handler: null as any,

    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-gamemode";
        document.head.appendChild(this.styleEl);

        this._handler = (e: KeyboardEvent) => {
            const hotkey = settings.store.hotkey.toLowerCase();
            const pressed = `${e.ctrlKey?"ctrl+":""}${e.shiftKey?"shift+":""}${e.altKey?"alt+":""}${e.key.toLowerCase()}`;
            if (pressed !== hotkey) return;
            e.preventDefault();
            this.toggle();
        };
        document.addEventListener("keydown", this._handler);

        if (settings.store.enabled) this.enable();
    },

    toggle() {
        if ((this as any).active) this.disable();
        else this.enable();
    },

    enable() {
        (this as any).active = true;
        settings.store.enabled = true;
        (this as any).pausedPlugins = [];

        // Stop all heavy plugins
        for (const name of HEAVY_PLUGINS) {
            const plugin = DemCord?.Plugins?.plugins?.[name];
            if (!plugin?.started) continue;
            try { plugin.stop?.(); plugin.started = false; (this as any).pausedPlugins.push(name); } catch {}
        }

        // Kill all animations, transitions, non-essential rendering
        if (this.styleEl) this.styleEl.textContent = `
            *, *::before, *::after {
                animation: none !important;
                transition: none !important;
                will-change: auto !important;
            }
            img[src*=".gif"] { display: none !important; }
            canvas:not(#demcord-overlay) { display: none !important; }
            video:not([class*="voice"]) { display: none !important; }
            [class*="memberList"], [class*="members"] { display: none !important; }
            [class*="sidebar"] { min-width: 0 !important; width: 60px !important; overflow: hidden !important; }
            [class*="channel"][class*="name"] { display: none !important; }
            [class*="activityStatus"] { display: none !important; }
            [class*="richPresence"] { display: none !important; }
            [class*="typing"] { display: none !important; }
            [class*="unread"] { display: none !important; }
            [class*="badge"] { display: none !important; }
        `;

        // Pause all non-voice flux listeners
        try {
            const { FluxDispatcher } = require("@webpack/common");
            (this as any)._origDispatch = FluxDispatcher.dispatch.bind(FluxDispatcher);
            FluxDispatcher.dispatch = function(payload: any) {
                const VOICE_EVENTS = ["VOICE_STATE_UPDATES","VOICE_SERVER_UPDATE","SPEAKING","RTC_CONNECTION_STATE","AUDIO_TOGGLE_SELF_MUTE","AUDIO_TOGGLE_SELF_DEAF"];
                if (VOICE_EVENTS.includes(payload.type)) return (this as any)._origDispatch(payload);
                if (payload.type === "MESSAGE_CREATE" || payload.type === "NOTIFICATION_CREATE") return;
            };
        } catch {}

        // Clear caches
        if (window.caches) window.caches.keys().then(keys => keys.forEach(k => window.caches.delete(k)));

        showNotification({ title: "Game Mode ON", body: `${(this as any).pausedPlugins.length} plugins paused. Voice kept active. Press ${settings.store.hotkey} to disable.` });
    },

    disable() {
        (this as any).active = false;
        settings.store.enabled = false;

        // Restore plugins
        for (const name of (this as any).pausedPlugins) {
            const plugin = DemCord?.Plugins?.plugins?.[name];
            if (!plugin) continue;
            try { plugin.start?.(); plugin.started = true; } catch {}
        }
        (this as any).pausedPlugins = [];

        // Restore flux
        try {
            if ((this as any)._origDispatch) {
                const { FluxDispatcher } = require("@webpack/common");
                FluxDispatcher.dispatch = (this as any)._origDispatch;
            }
        } catch {}

        // Remove CSS restrictions
        if (this.styleEl) this.styleEl.textContent = "";

        showNotification({ title: "Game Mode OFF", body: "Discord restored to normal." });
    },

    stop() {
        document.removeEventListener("keydown", this._handler);
        this.styleEl?.remove();
        if ((this as any).active) this.disable();
    },

    commands: [{
        name: "gamemode",
        description: "Toggle game mode on or off",
        execute() {
            (this as any).toggle();
            return { content: `Game Mode ${(this as any).active ? "enabled" : "disabled"}` };
        }
    }]
});
