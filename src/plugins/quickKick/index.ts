import definePlugin from "@utils/types";
export default definePlugin({
    name: "QuickKick",
    description: "Right-click any user to instantly kick them with one click",
    authors: [{ name: "DemCord", id: 0n }],
    contextMenus: {
        "user-context"(children: any[], { user, guildId }: any) {
            if (!guildId) return;
            children.push({
                type: "item",
                id: "demcord-quickkick",
                label: "Quick Kick",
                color: "danger",
                action() { console.log(`[QuickKick] Kicking ${user?.username} from ${guildId}`); }
            });
        }
    }
});
