import definePlugin from "@utils/types";

export default definePlugin({
    name: "WordCount",
    description: "Shows word count and character count while typing",
    authors: [{ name: "DemCord", id: 0n }],

    start() {
        const observer = new MutationObserver(() => {
            const textArea = document.querySelector("[class*='textArea']") as HTMLTextAreaElement;
            if (!textArea) return;
            const existing = document.getElementById("demcord-wordcount");
            const text = textArea.textContent || "";
            const words = text.trim() ? text.trim().split(/\s+/).length : 0;
            const chars = text.length;
            if (!existing) {
                const counter = document.createElement("div");
                counter.id = "demcord-wordcount";
                counter.style.cssText = "position:fixed;bottom:60px;right:20px;font-size:11px;color:#9b72cf;pointer-events:none;z-index:9999;";
                document.body.appendChild(counter);
            }
            const el = document.getElementById("demcord-wordcount");
            if (el) el.textContent = chars > 0 ? `${words}w / ${chars}c` : "";
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
        (this as any)._observer = observer;
    },

    stop() { (this as any)._observer?.disconnect(); document.getElementById("demcord-wordcount")?.remove(); }
});
