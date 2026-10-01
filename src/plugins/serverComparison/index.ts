import definePlugin from "@utils/types";
export default definePlugin({
    name: "ServerComparison",
    description: "Compare two servers side by side with stats",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "compareservers",
        description: "Compare this server with another",
        options: [{ name: "serverid", description: "Server ID to compare with", type: 3, required: true }],
        execute(opts, ctx) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const otherId = opts.find((o: any) => o.name === "serverid")?.value;
            return { content: `Comparing ${ctx.guild.name} (${ctx.guild.id}) with server ${otherId}\nMembers: ${(ctx.guild as any).memberCount || "Unknown"}\nChannels: ${Object.keys((ctx.guild as any).channels || {}).length}` };
        }
    }]
});
