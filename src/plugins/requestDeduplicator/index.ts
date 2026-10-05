import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    enabled: { type: OptionType.BOOLEAN, description: "Enable request deduplication", default: true },
    windowMs: { type: OptionType.NUMBER, description: "Dedup window in milliseconds", default: 500 }
});

export default definePlugin({
    name: "RequestDeduplicator",
    description: "Blocks duplicate Discord API requests that fire multiple times to save bandwidth and CPU",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    _originalFetch: null as any,
    recentRequests: new Map<string, number>(),

    start() {
        if (!settings.store.enabled) return;
        const self = this;
        this._originalFetch = window.fetch;
        window.fetch = async function(input: any, init?: any) {
            const url = typeof input === "string" ? input : input?.url || "";
            if (!url.includes("discord.com/api")) return self._originalFetch.apply(this, [input, init]);
            const method = init?.method || "GET";
            if (method !== "GET") return self._originalFetch.apply(this, [input, init]);
            const key = `${method}:${url}`;
            const now = Date.now();
            const last = self.recentRequests.get(key);
            if (last && now - last < settings.store.windowMs) {
                return new Response("{}", { status: 200, headers: { "Content-Type": "application/json" } });
            }
            self.recentRequests.set(key, now);
            if (self.recentRequests.size > 100) {
                const oldest = [...self.recentRequests.entries()].sort((a, b) => a[1] - b[1])[0];
                self.recentRequests.delete(oldest[0]);
            }
            return self._originalFetch.apply(this, [input, init]);
        };
    },

    stop() {
        if (this._originalFetch) window.fetch = this._originalFetch;
        this.recentRequests.clear();
    }
});
