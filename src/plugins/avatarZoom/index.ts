import definePlugin from "@utils/types";
export default definePlugin({
    name: "AvatarZoom",
    description: "Click any avatar to see it full size with zoom capability",
    authors: [{ name: "DemCord", id: 0n }],
    start() {
        document.addEventListener("click", this._handler = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.matches("[class*='avatar'] img, [class*='avatarWrapper'] img")) return;
            const src = (target as HTMLImageElement).src.replace(/\?size=\d+/, "?size=4096");
            const overlay = document.createElement("div");
            overlay.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:99999;display:flex;align-items:center;justify-content:center;cursor:zoom-out;";
            const img = document.createElement("img");
            img.src = src;
            img.style.cssText = "max-width:90%;max-height:90%;border-radius:50%;box-shadow:0 0 40px rgba(168,85,247,0.5);";
            overlay.appendChild(img);
            overlay.onclick = () => overlay.remove();
            document.body.appendChild(overlay);
        });
    },
    stop() { document.removeEventListener("click", this._handler); }
});
