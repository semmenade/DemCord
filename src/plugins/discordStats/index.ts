import definePlugin from "@utils/types";
export default definePlugin({
    name: "DiscordStats",
    description: "Shows your Discord usage statistics like Spotify Wrapped",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "mystats",
        description: "Show your Discord stats",
        execute(_, ctx) {
            const uptime = Math.floor(performance.now() / 3600000);
            return { content: `**Your Discord Stats**\nSession time: ${uptime}h\nServers: ${Object.keys((ctx.guild as any) || {}).length || "Unknown"}\nPowered by DemCord` };
        }
    }]
});
