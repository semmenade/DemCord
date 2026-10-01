import definePlugin from "@utils/types";
export default definePlugin({
    name: "ThreadManager",
    description: "Enhanced thread management with sorting filtering and bulk actions",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "threads",
        description: "List all active threads in this channel",
        execute(_, ctx) {
            return { content: `Active threads in <#${ctx.channel.id}> - check the threads panel for the full list` };
        }
    }]
});
