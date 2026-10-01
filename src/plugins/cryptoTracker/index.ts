import definePlugin from "@utils/types";

export default definePlugin({
    name: "CryptoTracker",
    description: "Live crypto prices accessible directly in Discord",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "crypto",
        description: "Get current price of a cryptocurrency",
        options: [{ name: "coin", description: "Coin symbol e.g. BTC ETH SOL", type: 3, required: true }],
        async execute(opts) {
            const coin = opts.find((o: any) => o.name === "coin")?.value?.toLowerCase();
            try {
                const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd&include_24hr_change=true`);
                const data = await res.json();
                const price = data[coin]?.usd;
                const change = data[coin]?.usd_24h_change?.toFixed(2);
                if (!price) return { content: `Could not find price for "${coin}"` };
                return { content: `${coin.toUpperCase()}: $${price.toLocaleString()} (${change}% 24h)` };
            } catch {
                return { content: `Could not fetch price for "${coin}"` };
            }
        }
    }]
});
