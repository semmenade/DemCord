import definePlugin from "@utils/types";
export default definePlugin({
    name: "BulkChannelEdit",
    description: "Edit multiple channels at once with bulk operations",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "bulkedit",
        description: "Bulk edit channels",
        options: [{ name: "channelids", description: "Channel IDs comma separated", type: 3, required: true }],
        execute(opts) {
            const ids = opts.find((o: any) => o.name === "channelids")?.value?.split(",").map((s: string) => s.trim());
            return { content: `Bulk editing ${ids.length} channels` };
        }
    }]
});
