import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "CustomEmojiCreator",
    description: "Upload and create custom emojis directly in Discord from a URL or file",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "emoji-create",
        description: "Create a custom emoji from a URL",
        options: [
            { name: "name", description: "Emoji name", type: 3, required: true },
            { name: "url", description: "Image URL for the emoji", type: 3, required: true }
        ],
        execute(opts: any[], ctx: any) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const name = opts.find((o: any) => o.name === "name")?.value;
            const url = opts.find((o: any) => o.name === "url")?.value;
            showNotification({ title: "CustomEmojiCreator", body: `Creating emoji :${name}: in ${ctx.guild.name}` });
            return { content: `Creating emoji :${name}: from ${url} in ${ctx.guild.name}` };
        }
    }]
});
