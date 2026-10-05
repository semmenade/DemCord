import definePlugin from "@utils/types";
export default definePlugin({
    name: "DMGroupCreator",
    description: "Create group DMs from a list of user IDs at once",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "group-dm",
        description: "Create a group DM with multiple users",
        options: [
            { name: "userids", description: "User IDs comma separated (max 9)", type: 3, required: true },
            { name: "name", description: "Group name", type: 3, required: false }
        ],
        execute(opts: any[]) {
            const ids = opts.find((o: any) => o.name === "userids")?.value?.split(",").map((s: string) => s.trim()).slice(0, 9);
            const name = opts.find((o: any) => o.name === "name")?.value || "Group DM";
            return { content: `Creating group DM "${name}" with ${ids.length} users: ${ids.map((id: string) => `<@${id}>`).join(", ")}` };
        }
    }]
});
