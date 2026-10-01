import definePlugin from "@utils/types";

export default definePlugin({
    name: "QuickDelete",
    description: "Press Ctrl+Delete to instantly delete your last message",
    authors: [{ name: "DemCord", id: 0n }],

    start() {
        document.addEventListener("keydown", this.onKey);
    },

    onKey(e: KeyboardEvent) {
        if (!e.ctrlKey || e.key !== "Delete") return;
        const messages = document.querySelectorAll("[class*='message']");
        const last = Array.from(messages).reverse().find((m: any) => m.querySelector("[class*='avatar']"));
        if (last) (last.querySelector("[class*='deleteButton']") as HTMLElement)?.click();
    },

    stop() {
        document.removeEventListener("keydown", this.onKey);
    }
});
