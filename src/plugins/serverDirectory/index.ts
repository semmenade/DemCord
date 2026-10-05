import definePlugin from "@utils/types";
export default definePlugin({
    name: "ServerDirectory",
    description: "Searchable directory of all channels roles and members in a server",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [
        { name: "dir-channels", description: "List all channels in this server", execute(_, ctx: any) { if (!ctx.guild) return { content: "Use this in a server" }; const channels = Object.values((ctx.guild as any).channels || {}) as any[]; const list = channels.sort((a: any, b: any) => a.name?.localeCompare(b.name)).map((c: any) => `${c.type === 2 ? "voice" : "text"}: ${c.name}`).join("\n"); return { content: `**Channels in ${ctx.guild.name}:**\n${list.slice(0, 1900)}` }; } },
        { name: "dir-search", description: "Search for a channel or role by name", options: [{ name: "query", description: "Search term", type: 3, required: true }], execute(opts: any[], ctx: any) { if (!ctx.guild) return { content: "Use this in a server" }; const q = opts.find((o: any) => o.name === "query")?.value?.toLowerCase(); const channels = Object.values((ctx.guild as any).channels || {}) as any[]; const results = channels.filter((c: any) => c.name?.toLowerCase().includes(q)); if (!results.length) return { content: `No channels found matching: ${q}` }; return { content: `**Search results for "${q}":**\n${results.map((c: any) => `<#${c.id}> (${c.type === 2 ? "voice" : "text"})`).join("\n")}` }; } }
    ]
});
