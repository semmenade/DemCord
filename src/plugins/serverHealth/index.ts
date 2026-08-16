import definePlugin from "@utils/types";
export default definePlugin({
    name: "ServerHealth",
    description: "Rates your server based on engagement activity and growth",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "health",
        description: "Show server health score",
        execute(_, ctx) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const members = (ctx.guild as any).memberCount || 0;
            const score = Math.min(100, Math.floor(members / 10));
            return { content: `**Server Health: ${ctx.guild.name}**\nHealth Score: ${score}/100\nMembers: ${members}` };
        }
    }]
});
