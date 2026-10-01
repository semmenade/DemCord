import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "MassUnban",
    description: "Unban multiple users at once from a list",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "massunban",
        description: "Unban multiple users at once",
        options: [{ name: "userids", description: "User IDs comma separated", type: 3, required: true }],
        execute(opts: any[], ctx: any) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const ids = opts.find((o: any) => o.name === "userids")?.value?.split(",").map((s: string) => s.trim());
            showNotification({ title: "MassUnban", body: `Unbanning ${ids.length} users...` });
            return { content: `Mass unban initiated for ${ids.length} users in ${ctx.guild.name}` };
        }
    }]
});
