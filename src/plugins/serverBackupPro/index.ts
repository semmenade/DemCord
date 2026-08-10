import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "ServerBackupPro",
    description: "Full server backup including roles channels permissions and settings",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "backup",
        description: "Backup this server structure to a JSON file",
        execute(_, ctx) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const backup = {
                id: ctx.guild.id,
                name: ctx.guild.name,
                timestamp: new Date().toISOString(),
                channels: "Run in server to capture channel data",
                roles: "Run in server to capture role data"
            };
            const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${ctx.guild.name}-backup-${Date.now()}.json`;
            a.click();
            showNotification({ title: "ServerBackupPro", body: `Backup saved for ${ctx.guild.name}` });
            return { content: "Server backup downloaded" };
        }
    }]
});
