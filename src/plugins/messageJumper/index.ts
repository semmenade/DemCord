import definePlugin from "@utils/types";

export default definePlugin({
    name: "MessageJumper",
    description: "Jump to any date in a channel history instantly",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "jumpto",
        description: "Jump to messages from a specific date",
        options: [{ name: "date", description: "Date e.g. 2024-01-15", type: 3, required: true }],
        execute(opts, ctx) {
            const date = opts.find((o: any) => o.name === "date")?.value;
            const timestamp = new Date(date).getTime();
            if (isNaN(timestamp)) return { content: "Invalid date format. Use YYYY-MM-DD" };
            const snowflake = (BigInt(timestamp) - 1420070400000n) << 22n;
            return { content: `Jumping to ${date}...\nhttps://discord.com/channels/${ctx.guild?.id || "@me"}/${ctx.channel.id}/${snowflake}` };
        }
    }]
});
