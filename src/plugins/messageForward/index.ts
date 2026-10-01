import definePlugin from "@utils/types";
export default definePlugin({
    name: "MessageForward",
    description: "Forward any message to another channel or DM with context",
    authors: [{ name: "DemCord", id: 0n }],
    contextMenus: {
        "message"(children: any[], { message }: any) {
            children.push({ type: "item", id: "demcord-forward", label: "Forward Message", action() { navigator.clipboard.writeText(`**Forwarded:** ${message.content}`); } });
        }
    },
    commands: [{
        name: "forward",
        description: "Forward a message by ID",
        options: [
            { name: "messageid", description: "Message ID to forward", type: 3, required: true },
            { name: "note", description: "Optional note to add", type: 3, required: false }
        ],
        execute(opts: any[]) {
            const id = opts.find((o: any) => o.name === "messageid")?.value;
            const note = opts.find((o: any) => o.name === "note")?.value || "";
            return { content: `**Forwarded message** (ID: ${id})${note ? `\n${note}` : ""}` };
        }
    }]
});
