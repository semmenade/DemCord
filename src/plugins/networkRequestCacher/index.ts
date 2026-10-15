import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    ttl: { type: OptionType.NUMBER, description: "Cache TTL in seconds", default: 30 },
    enabled: { type: OptionType.BOOLEAN, description: "Enable request caching", default: true }
});
export default definePlugin({
    name: "NetworkRequestCacher",
    description: "Caches repeated Discord API requests to reduce network usage and improve speed",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    cache: new Map<string, { data: any; time: number }>(),
    _originalFetch: null as any,
    start() {
        if (!settings.store.enabled) return;
        const self = this;
        this._originalFetch = window.fetch;
        window.fetch = async function(input: any, init?: any) {
            const url = typeof input === "string" ? input : input?.url || "";
            if (!url.includes("discord.com/api") || (init?.method && init.method !== "GET")) return self._originalFetch.apply(this, [input, init]);
            const cached = self.cache.get(url);
            if (cached && Date.now() - cached.time < settings.store.ttl * 1000) {
                return new Response(JSON.stringify(cached.data), { status: 200, headers: { "Content-Type": "application/json" } });
            }
            const res = await self._originalFetch.apply(this, [input, init]);
            const clone = res.clone();
            clone.json().then((data: any) => self.cache.set(url, { data, time: Date.now() })).catch(() => {});
            return res;
        };
    },
    stop() { if (this._originalFetch) window.fetch = this._originalFetch; this.cache.clear(); }
});
