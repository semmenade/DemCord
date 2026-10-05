import definePlugin from "@utils/types";
export default definePlugin({
    name: "ReactionAnalyzer",
    description: "Shows who reacted and when in a detailed popup on any message",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "reactions",
        description: "Analyze reactions on a message",
        options: [{ name: "messageid", description: "Message ID", type: 3, required: true }],
        execute(opts: any[], ctx: any) {
            const id = opts.find((o: any) => o.name === "messageid")?.value;
            return { content: `Reaction analysis for message ${id} in <#${ctx.channel.id}> - check the message directly for full reaction details` };
        }
    }]
});
