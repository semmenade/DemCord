import definePlugin from "@utils/types";
export default definePlugin({
    name: "APIRateDashboard",
    description: "Shows your current Discord API usage and remaining rate limit calls",
    authors: [{ name: "DemCord", id: 0n }],
    rateLimits: new Map<string, any>(),
    _originalFetch: null as any,
    start() {
        const self = this;
        this._originalFetch = window.fetch;
        window.fetch = async function(input: any, init?: any) {
            const res = await self._originalFetch.apply(this, [input, init]);
            const url = typeof input === "string" ? input : input?.url || "";
            if (url.includes("discord.com/api")) {
                const remaining = res.headers.get("x-ratelimit-remaining");
                const limit = res.headers.get("x-ratelimit-limit");
                const reset = res.headers.get("x-ratelimit-reset");
                if (remaining !== null) self.rateLimits.set(url.split("?")[0], { remaining, limit, reset });
            }
            return res;
        };
    },
    stop() { if (this._originalFetch) window.fetch = this._originalFetch; },
    commands: [{
        name: "ratelimits",
        description: "Show current API rate limit status",
        execute() {
            const limits = [...(this as any).rateLimits.entries()].slice(-10);
            if (!limits.length) return { content: "No rate limit data yet. Use Discord normally to collect data." };
            return { content: `**Rate Limits:**\n${limits.map(([url, data]: any) => `${url.split("/api/v9/")[1] || url}: ${data.remaining}/${data.limit}`).join("\n")}` };
        }
    }]
});
