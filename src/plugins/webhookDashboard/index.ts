import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    webhooks: { type: OptionType.STRING, description: "Saved webhooks", default: "[]", hidden: true }
});
function getWebhooks() { try { return JSON.parse(settings.store.webhooks); } catch { return []; } }
function saveWebhooks(w: any[]) { settings.store.webhooks = JSON.stringify(w); }
export default definePlugin({
    name: "WebhookDashboard",
    description: "Manage all webhooks across all servers in one panel",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        { name: "wh-add", description: "Add a webhook to dashboard", options: [{ name: "name", description: "Webhook name", type: 3, required: true }, { name: "url", description: "Webhook URL", type: 3, required: true }], execute(opts: any[]) { const name = opts.find((o: any) => o.name === "name")?.value; const url = opts.find((o: any) => o.name === "url")?.value; const w = getWebhooks(); w.push({ name, url, added: new Date().toDateString() }); saveWebhooks(w); return { content: `Webhook added to dashboard: ${name}` }; } },
        { name: "wh-list", description: "List all webhooks", execute() { const w = getWebhooks(); if (!w.length) return { content: "No webhooks saved. Use /wh-add to add one." }; return { content: `**Webhook Dashboard:**\n${w.map((wh: any) => `- ${wh.name} (added ${wh.added})`).join("\n")}` }; } },
        { name: "wh-send", description: "Send a message via webhook", options: [{ name: "name", description: "Webhook name", type: 3, required: true }, { name: "message", description: "Message to send", type: 3, required: true }], async execute(opts: any[]) { const name = opts.find((o: any) => o.name === "name")?.value; const msg = opts.find((o: any) => o.name === "message")?.value; const w = getWebhooks().find((wh: any) => wh.name === name); if (!w) return { content: `Webhook not found: ${name}` }; try { await fetch(w.url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: msg }) }); return { content: `Message sent via ${name}` }; } catch { return { content: `Failed to send via ${name}` }; } } }
    ]
});
