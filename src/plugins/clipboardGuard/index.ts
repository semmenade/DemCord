import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
const TOKEN_PATTERN = /[\w-]{24}\.[\w-]{6}\.[\w-]{38}/;
const PASSWORD_PATTERN = /password|passwd|pwd/i;
export default definePlugin({
    name: "ClipboardGuard",
    description: "Warns before pasting anything that looks like a token or password",
    authors: [{ name: "DemCord", id: 0n }],
    start() {
        document.addEventListener("paste", this._handler = async (e: ClipboardEvent) => {
            const text = e.clipboardData?.getData("text") || "";
            if (TOKEN_PATTERN.test(text)) {
                e.preventDefault();
                showNotification({ title: "ClipboardGuard", body: "Blocked paste - clipboard contains what looks like a Discord token!", color: "#f38ba8", permanent: true });
            } else if (PASSWORD_PATTERN.test(text) && text.length > 8) {
                showNotification({ title: "ClipboardGuard", body: "Warning - clipboard may contain a password. Be careful where you paste!" });
            }
        });
    },
    stop() { document.removeEventListener("paste", this._handler); }
});
