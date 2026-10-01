import definePlugin from "@utils/types";
export default definePlugin({
    name: "LinkPreview",
    description: "Shows a rich preview popup when hovering over links in chat",
    authors: [{ name: "DemCord", id: 0n }],
    start() {
        document.addEventListener("mouseover", this._handler = (e: MouseEvent) => {
            const target = e.target as HTMLAnchorElement;
            if (target.tagName !== "A" || !target.href) return;
            target.title = `Preview: ${target.href}`;
        });
    },
    stop() { document.removeEventListener("mouseover", this._handler); }
});
