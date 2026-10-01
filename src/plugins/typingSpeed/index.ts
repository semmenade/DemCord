import definePlugin from "@utils/types";

export default definePlugin({
    name: "TypingSpeed",
    description: "Shows your typing speed in WPM while composing messages",
    authors: [{ name: "DemCord", id: 0n }],

    startTime: null as number | null,
    charCount: 0,

    start() {
        const observer = new MutationObserver(() => {
            const textArea = document.querySelector("[class*='textArea'] [contenteditable]") as HTMLElement;
            if (!textArea) return;
            if (!(this as any)._listening) {
                (this as any)._listening = true;
                textArea.addEventListener("keydown", () => {
                    if (!(this as any).startTime) (this as any).startTime = Date.now();
                    (this as any).charCount++;
                    const elapsed = (Date.now() - (this as any).startTime) / 60000;
                    const wpm = elapsed > 0 ? Math.round((this as any).charCount / 5 / elapsed) : 0;
                    let el = document.getElementById("demcord-wpm");
                    if (!el) {
                        el = document.createElement("div");
                        el.id = "demcord-wpm";
                        el.style.cssText = "position:fixed;bottom:60px;right:80px;font-size:11px;color:#9b72cf;pointer-events:none;z-index:9999;";
                        document.body.appendChild(el);
                    }
                    el.textContent = `${wpm} WPM`;
                });
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        (this as any)._observer = observer;
    },

    stop() {
        (this as any)._observer?.disconnect();
        document.getElementById("demcord-wpm")?.remove();
    }
});
