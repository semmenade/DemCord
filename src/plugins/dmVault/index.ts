import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    vault: { type: OptionType.STRING, description: "Vault data", default: "[]", hidden: true },
    maxEntries: { type: OptionType.NUMBER, description: "Max DMs to store", default: 1000 }
});
function getVault() { try { return JSON.parse(settings.store.vault); } catch { return []; } }
function saveVault(v: any[]) { settings.store.vault = JSON.stringify(v.slice(-settings.store.maxEntries)); }
export default definePlugin({
    name: "DMVault",
    description: "Local archive of all your DMs that you can search and export",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    flux: {
        MESSAGE_CREATE({ message }: any) {
            if (message.guild_id) return;
            const vault = getVault();
            vault.push({ id: message.id, author: message.author?.username, authorId: message.author?.id, content: message.content, channelId: message.channel_id, timestamp: message.timestamp });
            saveVault(vault);
        }
    },
    commands: [
        {
            name: "vault-search",
            description: "Search your DM vault",
            options: [{ name: "query", description: "Search term", type: 3, required: true }],
            execute(opts: any[]) {
                const query = opts.find((o: any) => o.name === "query")?.value?.toLowerCase();
                const results = getVault().filter((m: any) => m.content?.toLowerCase().includes(query) || m.author?.toLowerCase().includes(query)).slice(-10);
                if (!results.length) return { content: `No results for: ${query}` };
                return { content: `**Vault Search: ${query}**\n${results.map((m: any) => `[${m.author}]: ${m.content?.slice(0, 100)}`).join("\n")}` };
            }
        },
        {
            name: "vault-export",
            description: "Export your DM vault to JSON",
            execute() {
                const vault = getVault();
                const blob = new Blob([JSON.stringify(vault, null, 2)], { type: "application/json" });
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `dm-vault-${Date.now()}.json`;
                a.click();
                return { content: `Exported ${vault.length} DM messages` };
            }
        },
        {
            name: "vault-stats",
            description: "Show DM vault stats",
            execute() {
                const vault = getVault();
                const authors = [...new Set(vault.map((m: any) => m.author))];
                return { content: `**DM Vault Stats**\nTotal messages: ${vault.length}\nUnique conversations: ${authors.length}` };
            }
        }
    ]
});
