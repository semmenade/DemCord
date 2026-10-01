import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "PinMessage",
    description: "Pin any message to your personal pinboard with a right click",
    authors: [{ name: "DemCord", id: 0n }],
    contextMenus: {
        "message"(children: any[], { message }: any) {
            children.push({
                type: "item",
                id: "demcord-pin",
                label: "Pin to Personal Board",
                action() {
                    const pins = JSON.parse(localStorage.getItem("demcord-pins") || "[]");
                    pins.push({ id: message.id, content: message.content, author: message.author?.username, time: new Date().toLocaleString() });
                    localStorage.setItem("demcord-pins", JSON.stringify(pins));
                    showNotification({ title: "PinMessage", body: "Message pinned to your personal board" });
                }
            });
        }
    },
    commands: [{
        name: "myboard",
        description: "Show your personal pinboard",
        execute() {
            const pins = JSON.parse(localStorage.getItem("demcord-pins") || "[]");
            if (!pins.length) return { content: "No pins yet. Right-click a message and select Pin to Personal Board." };
            return { content: `**Your Pinboard:**\n${pins.slice(-10).map((p: any, i: number) => `${i + 1}. [${p.author}]: ${p.content?.slice(0, 80)}`).join("\n")}` };
        }
    }]
});
