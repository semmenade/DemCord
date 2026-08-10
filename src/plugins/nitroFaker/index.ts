import definePlugin from "@utils/types";

export default definePlugin({
    name: "NitroFaker",
    description: "Use any animated avatar and banner without Nitro",
    authors: [{ name: "DemCord", id: 0n }],

    patches: [
        {
            find: "canUseAnimatedAvatar",
            replacement: { match: /canUseAnimatedAvatar\(\i\)/, replace: "true" }
        },
        {
            find: "canUsePremiumProfileCustomization",
            replacement: { match: /canUsePremiumProfileCustomization\(\i\)/, replace: "true" }
        },
        {
            find: "canUseAnimatedEmoji",
            replacement: { match: /canUseAnimatedEmoji\(\i\)/, replace: "true" }
        },
        {
            find: "canUseClientThemes",
            replacement: { match: /canUseClientThemes\(\i\)/, replace: "true" }
        }
    ]
});
