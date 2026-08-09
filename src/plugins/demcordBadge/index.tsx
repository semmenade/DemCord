import definePlugin from "@utils/types";
import { BadgePosition, ProfileBadge } from "@api/Badges";

const DemCordBadge: ProfileBadge = {
    description: "DemCord User",
    image: "https://files.catbox.moe/gp6p5h.gif",
    position: BadgePosition.START,
    shouldShow: () => true,
    onClick: () => window.open("https://github.com/semmenade/DemCord")
};

export default definePlugin({
    name: "DemCordBadge",
    description: "Shows a DemCord badge on all DemCord users profiles",
    authors: [{ name: "DemCord", id: 0n }],

    start() { Vencord.Api.Badges.addBadge(DemCordBadge); },
    stop() { Vencord.Api.Badges.removeBadge(DemCordBadge); }
});
