import definePlugin from "@utils/types";
export default definePlugin({
    name: "AnalyticsBoard",
    description: "Business metrics dashboard displayed in a Discord channel",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "dashboard",
        description: "Show your DemCord analytics dashboard",
        execute() {
            const uptime = Math.floor(performance.now() / 1000);
            const memory = (performance as any).memory ? Math.round((performance as any).memory.usedJSHeapSize / 1024 / 1024) : "N/A";
            return { content: `**DemCord Dashboard**\nSession uptime: ${Math.floor(uptime / 60)} min\nMemory usage: ${memory}MB\nPlugins loaded: ${Object.keys(Vencord.Plugins.plugins).length}` };
        }
    }]
});
