import definePlugin from "@utils/types";
export default definePlugin({
    name: "ScreenshotBlocker",
    description: "Attempts to detect and warn when Discord is being screenshotted",
    authors: [{ name: "DemCord", id: 0n }],
    start() {
        document.addEventListener("keydown", this._handler = (e: KeyboardEvent) => {
            if (e.key === "PrintScreen" || (e.metaKey && e.shiftKey && ["3","4","5"].includes(e.key))) {
                import("@api/Notifications").then(({ showNotification }) => {
                    showNotification({ title: "Screenshot Detected", body: "A screenshot was taken of Discord!", color: "#f38ba8" });
                });
            }
        });
    },
    stop() { document.removeEventListener("keydown", this._handler); }
});
