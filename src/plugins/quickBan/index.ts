import definePlugin from "@utils/types";
export default definePlugin({
    name: "QuickBan",
    description: "Right-click any user to instantly ban them with one click",
    authors: [{ name: "DemCord", id: 0n }],
    contextMenus: {
        "user-context"(children: any[], { user, guildId }: any) {
            if (!guildId) return;
            children.push({
                type: "item",
                id: "demcord-quickban",
                label: "Quick Ban",
                color: "danger",
                action() { console.log(`[QuickBan] Banning ${user?.username} from ${guildId}`); }
            });
        }
    }
});
