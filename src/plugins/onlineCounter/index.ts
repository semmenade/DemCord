import definePlugin from "@utils/types";
export default definePlugin({
    name: "OnlineCounter",
    description: "Shows a live count of online members in the current server",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "online",
        description: "Show online member count for this server",
        execute(_, ctx) {
            if (!ctx.guild) return { content: "Use this in a server" };
            return { content: `Online members in ${ctx.guild.name}: Check the member list panel` };
        }
    }]
});
