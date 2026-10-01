import definePlugin from "@utils/types";
export default definePlugin({
    name: "FreeSticker",
    description: "Use any Discord sticker without Nitro",
    authors: [{ name: "DemCord", id: 0n }],
    patches: [{
        find: "canUseStickersEverywhere",
        replacement: { match: /canUseStickersEverywhere\(\i\)/, replace: "true" }
    }]
});
