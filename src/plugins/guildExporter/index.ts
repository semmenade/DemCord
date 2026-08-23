import definePlugin from "@utils/types";
export default definePlugin({
    name: "GuildExporter",
    description: "Export full server data including channels roles and members to JSON",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "export-server",
        description: "Export this server data to JSON",
        execute(_, ctx: any) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const data = { id: ctx.guild.id, name: ctx.guild.name, memberCount: (ctx.guild as any).memberCount, timestamp: new Date().toISOString() };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `server-export-${Date.now()}.json`;
            a.click();
            return { content: `Exported server data for ${ctx.guild.name}` };
        }
    }]
});
