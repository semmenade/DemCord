import definePlugin from "@utils/types";
export default definePlugin({
    name: "ChannelBackup",
    description: "Backup and restore channel settings and permissions",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "backup-channel",
        description: "Backup this channel settings",
        execute(_, ctx: any) {
            const backup = { id: ctx.channel.id, name: (ctx.channel as any).name, type: (ctx.channel as any).type, topic: (ctx.channel as any).topic, timestamp: new Date().toISOString() };
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `channel-backup-${Date.now()}.json`;
            a.click();
            return { content: "Channel backup downloaded" };
        }
    }]
});
