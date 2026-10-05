import definePlugin from "@utils/types";
export default definePlugin({
    name: "SwipeToReply",
    description: "Swipe right on a message to reply like iMessage",
    authors: [{ name: "DemCord", id: 0n }],
    start() {
        let startX = 0;
        document.addEventListener("touchstart", this._touchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; }, { passive: true });
        document.addEventListener("touchend", this._touchEnd = (e: TouchEvent) => {
            const dx = e.changedTouches[0].clientX - startX;
            if (dx < 60) return;
            const target = e.target as HTMLElement;
            const msg = target.closest("[class*='message']");
            if (!msg) return;
            const replyBtn = msg.querySelector("[aria-label*='Reply']") as HTMLElement;
            replyBtn?.click();
        }, { passive: true });
    },
    stop() {
        document.removeEventListener("touchstart", this._touchStart);
        document.removeEventListener("touchend", this._touchEnd);
    }
});
