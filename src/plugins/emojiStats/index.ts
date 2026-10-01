import definePlugin from "@utils/types";
export default definePlugin({
    name: "EmojiStats",
    description: "Shows which emojis get used most in your server",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "emojistats-server",
        description: "Show most used emojis in this server",
        execute(_, ctx) {
            if (!ctx.guild) return { content: "Use this in a server" };
            return { content: `Emoji stats for ${ctx.guild.name} - data collected as members use emojis` };
        }
    }]
});
