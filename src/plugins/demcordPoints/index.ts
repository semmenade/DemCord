import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";

const settings = definePluginSettings({
    balance: { type: OptionType.NUMBER, description: "Your DP balance", default: 0 },
    totalEarned: { type: OptionType.NUMBER, description: "Total DP earned", default: 0 },
    lastDaily: { type: OptionType.STRING, description: "Last daily claim date", default: "" },
    transactions: { type: OptionType.STRING, description: "Transaction history", default: "[]", hidden: true }
});

function getTransactions() { try { return JSON.parse(settings.store.transactions); } catch { return []; } }
function saveTransactions(t: any[]) { settings.store.transactions = JSON.stringify(t.slice(-50)); }

function earn(amount: number, reason: string) {
    settings.store.balance += amount;
    settings.store.totalEarned += amount;
    const t = getTransactions();
    t.push({ type: "earn", amount, reason, time: new Date().toLocaleString() });
    saveTransactions(t);
    showNotification({ title: "DemCord Points", body: `+${amount} DP - ${reason}` });
}

function spend(amount: number, reason: string): boolean {
    if (settings.store.balance < amount) return false;
    settings.store.balance -= amount;
    const t = getTransactions();
    t.push({ type: "spend", amount, reason, time: new Date().toLocaleString() });
    saveTransactions(t);
    return true;
}

export default definePlugin({
    name: "DemCordPoints",
    description: "DemCord Points (DP) currency system - earn through achievements, spend in marketplace",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    flux: {
        MESSAGE_CREATE({ message, optimistic }: any) {
            if (!optimistic) return;
            const me = (window as any).DiscordNative?.remoteApp?.getCurrentUser?.()?.id;
            if (message.author?.id !== me) return;
            if (Math.random() < 0.05) earn(1, "Message sent");
        },
        MESSAGE_REACTION_ADD({ userId }: any) {
            const me = (window as any).DiscordNative?.remoteApp?.getCurrentUser?.()?.id;
            if (userId === me) earn(1, "Reaction added");
        }
    },

    start() {
        const today = new Date().toDateString();
        if (settings.store.lastDaily !== today) {
            settings.store.lastDaily = today;
            setTimeout(() => earn(10, "Daily login bonus"), 5000);
        }
    },

    commands: [
        {
            name: "dp",
            description: "Check your DemCord Points balance",
            execute() {
                return { content: `**DemCord Points (DP)**\nBalance: ${settings.store.balance} DP\nTotal earned: ${settings.store.totalEarned} DP` };
            }
        },
        {
            name: "dp-history",
            description: "Show your DP transaction history",
            execute() {
                const t = getTransactions().slice(-10).reverse();
                if (!t.length) return { content: "No transactions yet" };
                return { content: `**DP History:**\n${t.map((tx: any) => `${tx.type === "earn" ? "+" : "-"}${tx.amount} DP - ${tx.reason} (${tx.time})`).join("\n")}` };
            }
        },
        {
            name: "dp-daily",
            description: "Claim your daily DP bonus",
            execute() {
                const today = new Date().toDateString();
                if (settings.store.lastDaily === today) return { content: "You already claimed your daily bonus today. Come back tomorrow!" };
                settings.store.lastDaily = today;
                earn(10, "Daily bonus claimed");
                return { content: "Daily bonus claimed: +10 DP" };
            }
        }
    ]
});
