import definePlugin from "@utils/types";
export default definePlugin({
    name: "ServerTemplate",
    description: "Create and share server templates with one command",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "create-template",
        description: "Create a template from this server",
        options: [
            { name: "name", description: "Template name", type: 3, required: true },
            { name: "description", description: "Template description", type: 3, required: false }
        ],
        execute(opts: any[], ctx: any) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const name = opts.find((o: any) => o.name === "name")?.value;
            const desc = opts.find((o: any) => o.name === "description")?.value || "";
            return { content: `Template "${name}" would be created for ${ctx.guild.name}${desc ? `\nDescription: ${desc}` : ""}` };
        }
    }]
});
