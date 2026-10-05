import definePlugin from "@utils/types";
export default definePlugin({
    name: "MessageAgeIndicator",
    description: "Shows how old each message is in a subtle tag next to the timestamp",
    authors: [{ name: "DemCord", id: 0n }],
    styleEl: null as HTMLStyleElement | null,
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            document.querySelectorAll("[class*='message']").forEach((msg: any) => {
                if (msg.dataset.ageTagged) return;
                const ts = msg.querySelector("time");
                if (!ts) return;
                const time = new Date(ts.dateTime).getTime();
                if (!time) return;
                const diff = Date.now() - time;
                const mins = Math.floor(diff / 60000);
                const hours = Math.floor(diff / 3600000);
                const days = Math.floor(diff / 86400000);
                const label = days > 0 ? `${days}d` : hours > 0 ? `${hours}h` : `${mins}m`;
                const tag = document.createElement("span");
                tag.textContent = label;
                tag.style.cssText = "font-size:10px;color:#4b1080;margin-left:4px;";
                ts.parentElement?.appendChild(tag);
                msg.dataset.ageTagged = "1";
            });
        }, 5000);
    },
    stop() { clearInterval(this.interval); document.querySelectorAll("[data-age-tagged]").forEach(el => el.removeAttribute("data-age-tagged")); }
});
