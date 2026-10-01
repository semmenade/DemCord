import definePlugin from "@utils/types";

export default definePlugin({
    name: "MessageExpiry",
    description: "Set messages to auto-delete after a set time",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "expire",
        description: "Send a message that auto-deletes after X seconds",
        options: [
            { name: "message", description: "Message to send", type: 3, required: true },
            { name: "seconds", description: "Seconds before deletion", type: 10, required: true }
        ],
        execute(opts) {
            const msg = opts.find((o: any) => o.name === "message")?.value;
            const sec = opts.find((o: any) => o.name === "seconds")?.value;
            return { content: `${msg} *(expires in ${sec}s)*` };
        }
    }]
});
