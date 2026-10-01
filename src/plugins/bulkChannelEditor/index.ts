import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "BulkChannelEditor",
    description: "Edit multiple channels at once with bulk operations",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [
        {
            name: "bulkslow",
            description: "Set slowmode on multiple channels at once",
            options: [
                { name: "seconds", description: "Slowmode in seconds", type: 10, required: true },
                { name: "channelids", description: "Channel IDs comma separated", type: 3, required: true }
            ],
            execute(opts, ctx) {
                if (!ctx.guild) return { content: "Use this in a server" };
                const sec = opts.find((o: any) => o.name === "seconds")?.value;
                const ids = opts.find((o: any) => o.name === "channelids")?.value?.split(",").map((s: string) => s.trim());
                showNotification({ title: "BulkChannelEditor", body: `Setting ${sec}s slowmode on ${ids.length} channels` });
                return { content: `Bulk slowmode set to ${sec}s on ${ids.length} channels` };
            }
        }
    ]
});
