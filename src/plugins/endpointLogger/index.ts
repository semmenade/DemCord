import definePlugin from "@utils/types";
export default definePlugin({
    name: "EndpointLogger",
    description: "Logs all Discord API calls made by the client with response times",
    authors: [{ name: "DemCord", id: 0n }],
    _originalFetch: null as any,
    start() {
        this._originalFetch = window.fetch;
        window.fetch = async function(input: any, init?: any) {
            const url = typeof input === "string" ? input : input?.url;
            if (!url?.includes("discord.com/api")) return (window as any)._dcOrigFetch.apply(this, [input, init]);
            const start = performance.now();
            const res = await (window as any)._dcOrigFetch.apply(this, [input, init]);
            const time = (performance.now() - start).toFixed(0);
            console.log(`[EndpointLogger] ${init?.method || "GET"} ${url} - ${res.status} (${time}ms)`);
            return res;
        };
        (window as any)._dcOrigFetch = this._originalFetch;
    },
    stop() { if (this._originalFetch) window.fetch = this._originalFetch; }
});
