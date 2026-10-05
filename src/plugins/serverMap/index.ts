import definePlugin from "@utils/types";
export default definePlugin({
    name: "ServerMap",
    description: "Visual map of all channels and categories in a server",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "servermap",
        description: "Show a map of this server structure",
        execute(_, ctx: any) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const channels = Object.values((ctx.guild as any).channels || {}) as any[];
            const categories = channels.filter((c: any) => c.type === 4).sort((a: any, b: any) => a.position - b.position);
            const uncategorized = channels.filter((c: any) => c.type !== 4 && !c.parentId);
            let map = `**Server Map: ${ctx.guild.name}**\n`;
            for (const cat of categories) {
                map += `\n**${cat.name}**\n`;
                const children = channels.filter((c: any) => c.parentId === cat.id).sort((a: any, b: any) => a.position - b.position);
                for (const ch of children) map += `  ${ch.type === 2 ? "🔊" : "#"} ${ch.name}\n`;
            }
            if (uncategorized.length) { map += "\n**Uncategorized**\n"; for (const ch of uncategorized) map += `  # ${ch.name}\n`; }
            return { content: map.slice(0, 2000) };
        }
    }]
});
