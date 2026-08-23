import definePlugin from "@utils/types";
export default definePlugin({
    name: "MemberExporter",
    description: "Export server member list to CSV",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "export-members",
        description: "Export member list to CSV",
        execute(_, ctx: any) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const csv = "id,username,joined\n";
            const blob = new Blob([csv], { type: "text/csv" });
            const a = document.createElement("a");
            a.href = URL.createObjectURL(blob);
            a.download = `members-${Date.now()}.csv`;
            a.click();
            return { content: `Exporting members of ${ctx.guild.name}` };
        }
    }]
});
