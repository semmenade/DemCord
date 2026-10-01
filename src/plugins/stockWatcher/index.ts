import definePlugin from "@utils/types";
export default definePlugin({
    name: "StockWatcher",
    description: "Real-time stock prices and alerts for watched tickers",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "stock",
        description: "Get current stock price",
        options: [{ name: "ticker", description: "Stock ticker e.g. AAPL TSLA", type: 3, required: true }],
        async execute(opts) {
            const ticker = opts.find((o: any) => o.name === "ticker")?.value?.toUpperCase();
            try {
                const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/quote?symbols=${ticker}`);
                const data = await res.json();
                const quote = data?.quoteResponse?.result?.[0];
                if (!quote) return { content: `Could not find stock: ${ticker}` };
                return { content: `${ticker}: $${quote.regularMarketPrice?.toFixed(2)} (${quote.regularMarketChangePercent?.toFixed(2)}% today)` };
            } catch { return { content: `Could not fetch stock data for ${ticker}` }; }
        }
    }]
});
