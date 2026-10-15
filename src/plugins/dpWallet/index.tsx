import definePlugin from "@utils/types";
import { React } from "@webpack/common";
export default definePlugin({
    name: "DPWallet",
    description: "Shows your DemCord Points balance in the Discord sidebar",
    authors: [{ name: "DemCord", id: 0n }],
    styleEl: null as HTMLStyleElement | null,
    walletEl: null as HTMLDivElement | null,
    start() {
        this.styleEl = document.createElement("style");
        this.styleEl.textContent = "#demcord-wallet { position: fixed; bottom: 52px; left: 0; width: 72px; height: 32px; background: rgba(13,0,16,0.9); border-top: 1px solid rgba(168,85,247,0.3); display: flex; align-items: center; justify-content: center; font-size: 10px; color: #a855f7; font-weight: 700; font-family: monospace; z-index: 100; }";
        document.head.appendChild(this.styleEl);
        const wallet = document.createElement("div");
        wallet.id = "demcord-wallet";
        wallet.textContent = "0 DP";
        document.body.appendChild(wallet);
        this.walletEl = wallet;
        const interval = setInterval(() => {
            try {
                const { Settings } = require("@api/Settings");
                const balance = Settings?.plugins?.DemCordPoints?.balance || 0;
                if (wallet) wallet.textContent = `${balance} DP`;
            } catch {}
        }, 5000);
        (this as any)._interval = interval;
    },
    stop() { clearInterval((this as any)._interval); this.styleEl?.remove(); this.walletEl?.remove(); }
});
