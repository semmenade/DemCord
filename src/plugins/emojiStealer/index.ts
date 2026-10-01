import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "EmojiStealer",
    description: "Steal any custom emoji from any server and add it to yours",
    authors: [{ name: "DemCord", id: 0n }],
    contextMenus: {
        "message"(children: any[], { message }: any) {
            const emojis = message.content?.match(/<a?:(\w+):(\d+)>/g) || [];
            if (!emojis.length) return;
            children.push({ type: "separator" });
            emojis.slice(0, 5).forEach((emoji: string) => {
                const match = emoji.match(/<(a?):(\w+):(\d+)>/);
                if (!match) return;
                const [, animated, name, id] = match;
                const url = `https://cdn.discordapp.com/emojis/${id}.${animated ? "gif" : "png"}`;
                children.push({ type: "item", id: `steal-${id}`, label: `Steal :${name}:`, action() { navigator.clipboard.writeText(url); showNotification({ title: "EmojiStealer", body: `Copied URL for :${name}: to clipboard` }); } });
            });
        }
    }
});
