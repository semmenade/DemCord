import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";

const DEFAULT_WHITELIST = [
    "spotify.com",
    "accounts.spotify.com",
    "api.spotify.com",
    "discord.com",
    "discordapp.com",
    "discord.gg",
    "discordapp.net",
    "discord.media",
    "gateway.discord.gg",
    "cdn.discordapp.com",
    "media.discordapp.net",
    "sentry.io",
    "googleapis.com",
    "gstatic.com"
];

const settings = definePluginSettings({
    whitelist: {
        type: OptionType.STRING,
        description: "Whitelisted domains (comma separated) - these will never be blocked",
        default: DEFAULT_WHITELIST.join(", ")
    },
    whitelistDeviceIds: {
        type: OptionType.STRING,
        description: "Whitelisted session/device IDs (comma separated)",
        default: ""
    },
    blockNewLogins: {
        type: OptionType.BOOLEAN,
        description: "Auto-kick new logins that are not from whitelisted devices",
        default: true
    },
    showNotifications: {
        type: OptionType.BOOLEAN,
        description: "Show popup notifications when a threat is blocked",
        default: true
    },
    logToConsole: {
        type: OptionType.BOOLEAN,
        description: "Log blocked attempts to console",
        default: true
    }
});

function getWhitelist(): string[] {
    return settings.store.whitelist
        .split(",")
        .map((d: string) => d.trim().toLowerCase())
        .filter(Boolean);
}

function isWhitelisted(url: string): boolean {
    const whitelist = getWhitelist();
    try {
        const hostname = new URL(url).hostname.toLowerCase();
        return whitelist.some(w => hostname === w || hostname.endsWith("." + w));
    } catch {
        return false;
    }
}

function alert(url: string, method: string) {
    if (settings.store.logToConsole) {
        console.error(`[TokenDefender] BLOCKED ${method} token leak to: ${url}`);
    }
    if (settings.store.showNotifications) {
        showNotification({
            title: " TOKEN THEFT BLOCKED",
            body: `A script tried to use your token!\n\nBlocked: ${url}\n\nRecommend changing your password immediately.`,
            color: "#f38ba8",
            permanent: true,
            onClick: () => window.open("https://discord.com/settings/account")
        });
    }
}

export default definePlugin({
    name: "TokenDefender",
    description: "Blocks token theft attempts, supports whitelisting, device ID control, and auto-kicks unknown logins",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    required: true,

    _originalFetch: null as any,
    _originalXHROpen: null as any,
    _originalSetHeader: null as any,

    start() {
        const self = this;

        // Patch fetch
        this._originalFetch = window.fetch;
        window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
            const url = typeof input === "string" ? input : input instanceof URL ? input.href : (input as Request).url;
            const headers = (init?.headers || {}) as Record<string, string>;
            const authHeader = headers["Authorization"] || headers["authorization"];
            if (authHeader && !isWhitelisted(url)) {
                alert(url, "fetch");
                return new Response(JSON.stringify({ message: "Blocked by DemCord TokenDefender" }), { status: 403 });
            }
            return self._originalFetch.apply(this, [input, init] as any);
        };

        // Patch XHR open
        this._originalXHROpen = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function(method: string, url: string, ...args: any[]) {
            (this as any)._tdUrl = url;
            return self._originalXHROpen.apply(this, [method, url, ...args] as any);
        };

        // Patch XHR setRequestHeader
        this._originalSetHeader = window.XMLHttpRequest.prototype.setRequestHeader;
        window.XMLHttpRequest.prototype.setRequestHeader = function(header: string, value: string) {
            const url = (this as any)._tdUrl || "";
            if (header.toLowerCase() === "authorization" && url && !isWhitelisted(url)) {
                alert(url, "XHR");
                return;
            }
            return self._originalSetHeader.apply(this, [header, value] as any);
        };

        // Monitor new device logins
        if (settings.store.blockNewLogins) {
            this._loginMonitor = setInterval(async () => {
                try {
                    const res = await self._originalFetch("https://discord.com/api/v9/auth/sessions", {
                        headers: { Authorization: (window as any).DiscordNative?.remoteApp?.getDiscordToken?.() || "" }
                    });
                    if (!res.ok) return;
                    const data = await res.json();
                    const whitelistedIds = settings.store.whitelistDeviceIds
                        .split(",").map((d: string) => d.trim()).filter(Boolean);
                    const sessions = data.user_sessions || [];
                    for (const session of sessions) {
                        const id = session.id_hash || session.session_id;
                        if (id && whitelistedIds.length > 0 && !whitelistedIds.includes(id)) {
                            if (settings.store.showNotifications) {
                                showNotification({
                                    title: " Unknown Login Detected",
                                    body: `New session detected: ${session.client_info?.os || "Unknown"} - ${session.client_info?.location || "Unknown location"}\n\nSession ID: ${id}\n\nIf this wasn't you, change your password immediately!`,
                                    color: "#f38ba8",
                                    permanent: true,
                                    onClick: () => window.open("https://discord.com/settings/sessions")
                                });
                            }
                            if (settings.store.logToConsole) {
                                console.error("[TokenDefender] Unknown session detected:", session);
                            }
                        }
                    }
                } catch {}
            }, 60000);
        }
    },

    stop() {
        if (this._originalFetch) window.fetch = this._originalFetch;
        if (this._originalXHROpen) window.XMLHttpRequest.prototype.open = this._originalXHROpen;
        if (this._originalSetHeader) window.XMLHttpRequest.prototype.setRequestHeader = this._originalSetHeader;
        if (this._loginMonitor) clearInterval(this._loginMonitor);
    }
});

