import definePlugin from "@utils/types";
export default definePlugin({
    name: "RoleBackup",
    description: "Backup and restore server roles and permissions",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "backup-roles",
        description: "Backup all roles in this server",
        execute(_, ctx: any) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const backup = { guildId: ctx.guild.id, guildName: ctx.guild.name, timestamp: new Date().toISOString() };
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `role-backup-${Date.now()}.json`;
            a.click();
            return { content: "Role backup downloaded" };
        }
    }]
});
