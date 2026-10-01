import definePlugin from "@utils/types";
export default definePlugin({
    name: "MutualServers",
    description: "Shows all mutual servers with any user in their profile",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "mutual",
        description: "Show mutual servers with a user",
        options: [{ name: "userid", description: "User ID", type: 3, required: true }],
        execute(opts) {
            const id = opts.find((o: any) => o.name === "userid")?.value;
            return { content: `Showing mutual servers with <@${id}> - check their profile for the full list` };
        }
    }]
});
