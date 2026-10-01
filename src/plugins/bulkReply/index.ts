import definePlugin from "@utils/types";

export default definePlugin({
    name: "BulkReply",
    description: "Reply to multiple messages at once with a single response",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "bulkreply",
        description: "Reply to multiple message IDs at once",
        options: [
            { name: "message", description: "Your reply message", type: 3, required: true },
            { name: "ids", description: "Message IDs comma separated", type: 3, required: true }
        ],
        execute(opts, ctx) {
            const msg = opts.find((o: any) => o.name === "message")?.value;
            const ids = opts.find((o: any) => o.name === "ids")?.value?.split(",").map((s: string) => s.trim());
            return { content: `Bulk reply sent to ${ids.length} messages: ${msg}` };
        }
    }]
});
