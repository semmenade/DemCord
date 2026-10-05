import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "BulkEmojiDownloader",
    description: "Download all emojis from any server as individual files",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "download-emojis",
        description: "Download all emojis from this server",
        execute(_, ctx: any) {
            if (!ctx.guild) return { content: "Use this in a server" };
            const emojis = (ctx.guild as any).emojis || {};
            const emojiList = Object.values(emojis) as any[];
            if (!emojiList.length) return { content: "No custom emojis in this server" };
            let downloaded = 0;
            emojiList.forEach((emoji: any) => {
                const ext = emoji.animated ? "gif" : "png";
                const url = `https://cdn.discordapp.com/emojis/${emoji.id}.${ext}`;
                const a = document.createElement("a");
                a.href = url;
                a.download = `${emoji.name}.${ext}`;
                a.click();
                downloaded++;
            });
            showNotification({ title: "BulkEmojiDownloader", body: `Downloading ${downloaded} emojis from ${ctx.guild.name}` });
            return { content: `Downloading ${downloaded} emojis` };
        }
    }]
});
