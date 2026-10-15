import definePlugin from "@utils/types";
export default definePlugin({
    name: "TelemetryReducer",
    description: "Reduces Discord telemetry and analytics calls to save bandwidth and CPU",
    authors: [{ name: "DemCord", id: 0n }],
    _originalFetch: null as any,
    BLOCKED: ["science", "track", "telemetry", "analytics", "sentry", "report"],
    start() {
        const self = this;
        this._originalFetch = window.fetch;
        window.fetch = async function(input: any, init?: any) {
            const url = typeof input === "string" ? input : input?.url || "";
            if (self.BLOCKED.some(b => url.includes(b))) return new Response("{}", { status: 200 });
            return self._originalFetch.apply(this, [input, init]);
        };
    },
    stop() { if (this._originalFetch) window.fetch = this._originalFetch; }
});
