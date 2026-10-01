import definePlugin from "@utils/types";

function snowflakeToDate(id: string) {
    return new Date(Number(BigInt(id) >> 22n) + 1420070400000);
}

export default definePlugin({
    name: "ServerAge",
    description: "Shows how old any server or account is",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [
        {
            name: "serverage",
            description: "Show how old this server is",
            execute(_, ctx) {
                if (!ctx.guild) return { content: "Use this in a server" };
                const created = snowflakeToDate(ctx.guild.id);
                const days = Math.floor((Date.now() - created.getTime()) / 86400000);
                return { content: `${ctx.guild.name} was created on ${created.toDateString()} (${days} days ago)` };
            }
        },
        {
            name: "accountage",
            description: "Show how old a user account is",
            options: [{ name: "userid", description: "User ID", type: 3, required: true }],
            execute(opts) {
                const id = opts.find((o: any) => o.name === "userid")?.value;
                const created = snowflakeToDate(id);
                const days = Math.floor((Date.now() - created.getTime()) / 86400000);
                return { content: `Account ${id} was created on ${created.toDateString()} (${days} days ago)` };
            }
        }
    ]
});
