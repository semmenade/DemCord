import definePlugin from "@utils/types";

const DP_PACKAGES = [
    { id: "starter", name: "Starter Pack", dp: 1000, price: "$1.99", bonus: "" },
    { id: "popular", name: "Popular Pack", dp: 5500, price: "$4.99", bonus: "+500 bonus" },
    { id: "pro", name: "Pro Pack", dp: 12000, price: "$9.99", bonus: "+2000 bonus" },
    { id: "elite", name: "Elite Pack", dp: 30000, price: "$19.99", bonus: "+5000 bonus" },
    { id: "legendary", name: "Legendary Pack", dp: 75000, price: "$39.99", bonus: "+15000 bonus" }
];

const BUNDLE_PRICES = [
    { name: "Starter Bundle", dp: 500, desc: "Best plugins pre-configured for new users" },
    { name: "Security Bundle", dp: 750, desc: "All security and privacy plugins configured" },
    { name: "Gaming Bundle", dp: 600, desc: "Game mode + performance plugins optimized" },
    { name: "Aesthetic Bundle", dp: 800, desc: "All themes + UI plugins + custom effects" },
    { name: "Creator Bundle", dp: 1000, desc: "All dev tools + analytics + bot builder" },
    { name: "Ultimate Bundle", dp: 2500, desc: "Everything included - all plugins configured" }
];

export default definePlugin({
    name: "DPStore",
    description: "Buy DemCord Points with real money or browse marketplace bundle prices",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [
        { name: "buy-dp", description: "Browse DP packages available for purchase", execute() {
            const list = DP_PACKAGES.map(p => `**${p.name}** - ${p.dp.toLocaleString()} DP ${p.bonus ? `(${p.bonus})` : ""} - ${p.price}`).join("\n");
            return { content: `**DemCord Points Store:**\n${list}\n\nTo purchase visit: https://demcord.dev/store\nOr donate via: https://ko-fi.com/demcord\n\nDP are added to your account within 24 hours of donation.` };
        }},
        { name: "bundle-prices", description: "Show all marketplace bundle prices", execute() {
            const list = BUNDLE_PRICES.map(b => `**${b.name}** - ${b.dp.toLocaleString()} DP\n  ${b.desc}`).join("\n");
            return { content: `**Marketplace Bundle Prices:**\n${list}\n\nUse /bundles to browse and install.` };
        }}
    ]
});
