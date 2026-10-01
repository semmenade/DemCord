import definePlugin from "@utils/types";
export default definePlugin({
    name: "FakeNitro",
    description: "Use any Discord sticker without Nitro by sending as image link",
    authors: [{ name: "DemCord", id: 0n }],
    patches: [
        {
            find: "canUseStickersEverywhere",
            replacement: { match: /canUseStickersEverywhere\(\i\)/, replace: "true" }
        },
        {
            find: "canUseHighVideoUploadQuality",
            replacement: { match: /canUseHighVideoUploadQuality\(\i\)/, replace: "true" }
        }
    ]
});
