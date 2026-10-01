import definePlugin from "@utils/types";
export default definePlugin({
    name: "PacketAnalyzer",
    description: "See raw gateway packets and websocket frames in real-time",
    authors: [{ name: "DemCord", id: 0n }],
    enabled: false,
    commands: [
        {
            name: "packets-start",
            description: "Start logging gateway packets to console",
            execute() {
                (this as any).enabled = true;
                return { content: "Packet logging started. Check console." };
            }
        },
        {
            name: "packets-stop",
            description: "Stop logging gateway packets",
            execute() {
                (this as any).enabled = false;
                return { content: "Packet logging stopped." };
            }
        }
    ],
    flux: {
        "*"(event: any) {
            if ((this as any).enabled) console.log(`[PacketAnalyzer]`, event?.type, event);
        }
    }
});
