import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    key: { type: OptionType.STRING, description: "Encryption key (share with friends)", default: "" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable message encryption", default: false }
});
function encrypt(text: string, key: string): string {
    let result = "";
    for (let i = 0; i < text.length; i++) result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    return "🔐" + btoa(result);
}
function decrypt(text: string, key: string): string {
    try {
        const b = atob(text.slice(2));
        let result = "";
        for (let i = 0; i < b.length; i++) result += String.fromCharCode(b.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        return result;
    } catch { return text; }
}
export default definePlugin({
    name: "MessageEncryption",
    description: "End-to-end encrypt messages between DemCord users using a shared key",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        { name: "encrypt", description: "Send an encrypted message", options: [{ name: "message", description: "Message to encrypt", type: 3, required: true }], execute(opts: any[]) { const msg = opts.find((o: any) => o.name === "message")?.value; if (!settings.store.key) return { content: "Set an encryption key in plugin settings first" }; return { content: encrypt(msg, settings.store.key) }; } },
        { name: "decrypt", description: "Decrypt an encrypted message", options: [{ name: "message", description: "Encrypted message", type: 3, required: true }], execute(opts: any[]) { const msg = opts.find((o: any) => o.name === "message")?.value; if (!settings.store.key) return { content: "Set an encryption key in plugin settings first" }; return { content: decrypt(msg, settings.store.key) }; } }
    ]
});
