import definePlugin from "@utils/types";
export default definePlugin({
    name: "CacheViewer",
    description: "View Discord internal Flux store and cache data",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "cache",
        description: "View a specific Discord store",
        options: [{ name: "store", description: "Store name e.g. UserStore GuildStore", type: 3, required: true }],
        execute(opts) {
            const storeName = opts.find((o: any) => o.name === "store")?.value;
            try {
                const { [storeName]: store } = require("@webpack/common");
                if (!store) return { content: `Store not found: ${storeName}` };
                return { content: `Store ${storeName} found. Check console for data.` };
            } catch {
                return { content: `Could not access store: ${storeName}` };
            }
        }
    }]
});
