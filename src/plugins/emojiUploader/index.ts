import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "EmojiUploader",
    description: "Upload more emojis than your server tier allows",
    authors: [{ name: "DemCord", id: 0n }],
    patches: [{
        find: "maxEmojis",
        replacement: {
            match: /maxEmojis:\i/,
            replace: "maxEmojis:999"
        }
    }],
    commands: [{
        name: "uploademoji",
        description: "Upload an emoji from a URL",
        options: [
            { name: "name", description: "Emoji name", type: 3, required: true },
            { name: "url", description: "Image URL", type: 3, required: true }
        ],
        execute(opts, ctx) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const name = opts.find((o: any) => o.name === "name")?.value;
            const url = opts.find((o: any) => o.name === "url")?.value;
            showNotification({ title: "EmojiUploader", body: `Uploading emoji :${name}: to ${ctx.guild.name}` });
            return { content: `Uploading emoji :${name}: from ${url}` };
        }
    }]
});
