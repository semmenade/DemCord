import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "DPTransfer",
    description: "Transfer DemCord Points to other users",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "dp-send",
        description: "Send DP to another user",
        options: [
            { name: "userid", description: "User ID to send DP to", type: 3, required: true },
            { name: "amount", description: "Amount of DP to send", type: 10, required: true }
        ],
        execute(opts: any[]) {
            const userId = opts.find((o: any) => o.name === "userid")?.value;
            const amount = opts.find((o: any) => o.name === "amount")?.value;
            try {
                const { Settings } = require("@api/Settings");
                const balance = Settings?.plugins?.DemCordPoints?.balance || 0;
                if (balance < amount) return { content: `Insufficient DP. You have ${balance} DP.` };
                Settings.plugins.DemCordPoints.balance -= amount;
                showNotification({ title: "DemCord Points", body: `Sent ${amount} DP to <@${userId}>` });
                return { content: `Sent ${amount} DP to <@${userId}>. New balance: ${Settings.plugins.DemCordPoints.balance} DP` };
            } catch { return { content: "Could not process transfer" }; }
        }
    }]
});
