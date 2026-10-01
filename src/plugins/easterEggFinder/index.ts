import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
const eggs = [
    { key: "discordian", message: "You found the Discordian Easter Egg!" },
    { key: "demcord", message: "You found the DemCord secret!" },
    { key: "iddqd", message: "God Mode activated!" }
];
export default definePlugin({
    name: "EasterEggFinder",
    description: "Discover hidden easter eggs in Discord and DemCord",
    authors: [{ name: "DemCord", id: 0n }],
    buffer: "",
    start() {
        document.addEventListener("keydown", this._handler = (e: KeyboardEvent) => {
            (this as any).buffer = ((this as any).buffer + e.key).slice(-20).toLowerCase();
            for (const egg of eggs) {
                if ((this as any).buffer.includes(egg.key)) {
                    showNotification({ title: "Easter Egg Found", body: egg.message });
                    (this as any).buffer = "";
                }
            }
        });
    },
    stop() { document.removeEventListener("keydown", this._handler); }
});
