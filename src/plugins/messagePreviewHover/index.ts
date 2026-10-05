import definePlugin from "@utils/types";
export default definePlugin({
    name: "MessagePreviewHover",
    description: "Hover over a reply or mention to preview that message inline",
    authors: [{ name: "DemCord", id: 0n }],
    start() {
        document.addEventListener("mouseover", this._handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const reply = target.closest("[class*='repliedMessage']") as HTMLElement;
            if (!reply) return;
            const existing = document.getElementById("demcord-preview");
            if (existing) return;
            const preview = document.createElement("div");
            preview.id = "demcord-preview";
            const rect = reply.getBoundingClientRect();
            preview.style.cssText = `position:fixed;top:${rect.bottom + 4}px;left:${rect.left}px;background:rgba(13,0,16,0.95);border:1px solid rgba(168,85,247,0.4);border-radius:10px;padding:10px 14px;z-index:99999;max-width:320px;font-size:13px;color:#e9d5ff;backdrop-filter:blur(12px);pointer-events:none;`;
            preview.textContent = reply.textContent || "Message preview";
            document.body.appendChild(preview);
            reply.addEventListener("mouseleave", () => preview.remove(), { once: true });
        });
    },
    stop() { document.removeEventListener("mouseover", this._handler); document.getElementById("demcord-preview")?.remove(); }
});
