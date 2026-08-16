import definePlugin from "@utils/types";
export default definePlugin({
    name: "AnimatedPFP",
    description: "Use animated avatar without Nitro via CSS",
    authors: [{ name: "DemCord", id: 0n }],
    patches: [{
        find: "canUseAnimatedAvatar",
        replacement: { match: /canUseAnimatedAvatar\(\i\)/, replace: "true" }
    }]
});
