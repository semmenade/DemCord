import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    webhooks: { type: OptionType.STRING, description: "Saved webhooks JSON", default: "{}", hidden: true }
});
function getWebhooks() { try { return JSON.parse(settings.store.webhooks); } catch { return {}; } }
function saveWebhooks(w: any) { settings.store.webhooks = JSON.stringify(w); }
export default definePlugin({
    name: "WebhookManager",
    description: "Create manage and test Discord webhooks without leaving Discord",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        {
            name: "webhook-save",
            description: "Save a webhook URL with a name",
            options: [
                { name: "name", description: "Webhook name", type: 3, required: true },
                { name: "url", description: "Webhook URL", type: 3, required: true }
            ],
            execute(opts) {
                const name = opts.find((o: any) => o.name === "name")?.value;
                const url = opts.find((o: any) => o.name === "url")?.value;
                const webhooks = getWebhooks();
                webhooks[name] = url;
                saveWebhooks(webhooks);
                return { content: `Webhook saved: ${name}` };
            }
        },
        {
            name: "webhook-send",
            description: "Send a message to a saved webhook",
            options: [
                { name: "name", description: "Webhook name", type: 3, required: true },
                { name: "message", description: "Message to send", type: 3, required: true }
            ],
            async execute(opts) {
                const name = opts.find((o: any) => o.name === "name")?.value;
                const message = opts.find((o: any) => o.name === "message")?.value;
                const webhooks = getWebhooks();
                if (!webhooks[name]) return { content: `Webhook not found: ${name}` };
                try {
                    await fetch(webhooks[name], { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: message }) });
                    return { content: `Message sent to webhook: ${name}` };
                } catch { return { content: `Failed to send to webhook: ${name}` }; }
            }
        }
    ]
});
