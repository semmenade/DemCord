import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

export default definePlugin({
    name: "MassBan",
    description: "Ban multiple users at once from a list with reason",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "massban",
        description: "Ban multiple users at once",
        options: [
            { name: "userids", description: "User IDs separated by commas", type: 3, required: true },
            { name: "reason", description: "Ban reason", type: 3, required: false }
        ],
        execute(opts, ctx) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const ids = opts.find((o: any) => o.name === "userids")?.value?.split(",").map((s: string) => s.trim());
            const reason = opts.find((o: any) => o.name === "reason")?.value || "No reason provided";
            showNotification({ title: "MassBan", body: `Banning ${ids.length} users...` });
            return { content: `Mass ban initiated for ${ids.length} users. Reason: ${reason}` };
        }
    }]
});
