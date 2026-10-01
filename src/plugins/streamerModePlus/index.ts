import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    blurUsernames: { type: OptionType.BOOLEAN, description: "Blur all usernames", default: true },
    blurAvatars: { type: OptionType.BOOLEAN, description: "Blur all avatars", default: false },
    blurMessages: { type: OptionType.BOOLEAN, description: "Blur message content", default: false },
    blurServerNames: { type: OptionType.BOOLEAN, description: "Blur server names", default: true },
    keepOwnMessages: { type: OptionType.BOOLEAN, description: "Keep your own messages visible", default: true },
    enabled: { type: OptionType.BOOLEAN, description: "Enable streamer mode plus", default: false }
});

export default definePlugin({
    name: "StreamerModePlus",
    description: "Enhanced streamer mode that selectively blurs elements while keeping others visible",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    styleEl: null as HTMLStyleElement | null,

    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.id = "demcord-streamer";
        document.head.appendChild(this.styleEl);
        if (settings.store.enabled) this.apply();
    },

    apply() {
        const rules: string[] = [];
        if (settings.store.blurUsernames) rules.push(`[class*="username"], [class*="usernameFont"] { filter: blur(6px) !important; } [class*="username"]:hover, [class*="usernameFont"]:hover { filter: none !important; }`);
        if (settings.store.blurAvatars) rules.push(`[class*="avatar"] img { filter: blur(8px) !important; } [class*="avatar"] img:hover { filter: none !important; }`);
        if (settings.store.blurMessages) rules.push(`[class*="messageContent"] { filter: blur(4px) !important; } [class*="messageContent"]:hover { filter: none !important; }`);
        if (settings.store.blurServerNames) rules.push(`[class*="guildName"], [class*="name"][class*="guild"] { filter: blur(6px) !important; } [class*="guildName"]:hover { filter: none !important; }`);
        if (this.styleEl) this.styleEl.textContent = rules.join("\n");
    },

    stop() { this.styleEl?.remove(); },

    commands: [{
        name: "streamer",
        description: "Toggle streamer mode plus",
        execute() {
            settings.store.enabled = !settings.store.enabled;
            if (settings.store.enabled) (this as any).apply();
            else if ((this as any).styleEl) (this as any).styleEl.textContent = "";
            return { content: `Streamer mode plus ${settings.store.enabled ? "enabled" : "disabled"}` };
        }
    }]
});

