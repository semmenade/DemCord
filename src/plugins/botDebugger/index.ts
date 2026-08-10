import definePlugin from "@utils/types";
export default definePlugin({
    name: "BotDebugger",
    description: "See raw websocket events from Discord in real-time in console",
    authors: [{ name: "DemCord", id: 0n }],
    start() {
        (this as any)._dispatch = (event: any) => { console.log(`[BotDebugger] Event: ${event.type}`, event); };
        const { FluxDispatcher } = require("@webpack/common");
        FluxDispatcher.register((this as any)._dispatch);
    },
    stop() {
        const { FluxDispatcher } = require("@webpack/common");
        FluxDispatcher.unregister((this as any)._dispatch);
    }
});
