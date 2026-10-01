import definePlugin from "@utils/types";
import { Toasts } from "@webpack/common";

export default definePlugin({
    name: "LinkCopier",
    description: "One-click copy message link for any message in context menu",
    authors: [{ name: "DemCord", id: 0n }],

    contextMenus: {
        "message"(children: any[], { message, channel }: any) {
            children.push({
                type: "item",
                id: "demcord-copy-link",
                label: "Copy Message Link",
                action() {
                    const guildId = channel.guild_id || "@me";
                    const link = `https://discord.com/channels/${guildId}/${channel.id}/${message.id}`;
                    navigator.clipboard.writeText(link);
                    Toasts.show({ message: "Message link copied!", type: Toasts.Type.SUCCESS });
                }
            });
        }
    }
});
