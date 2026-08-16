import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    contacts: { type: OptionType.STRING, description: "CRM contacts JSON", default: "[]", hidden: true }
});
function getContacts() { try { return JSON.parse(settings.store.contacts); } catch { return []; } }
function saveContacts(c: any[]) { settings.store.contacts = JSON.stringify(c); }
export default definePlugin({
    name: "CRMIntegration",
    description: "Track client conversations in Discord with a built-in CRM",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        {
            name: "crm-add",
            description: "Add a contact to your CRM",
            options: [
                { name: "name", description: "Contact name", type: 3, required: true },
                { name: "userid", description: "Discord User ID", type: 3, required: true },
                { name: "notes", description: "Notes about this contact", type: 3, required: false }
            ],
            execute(opts) {
                const name = opts.find((o: any) => o.name === "name")?.value;
                const userid = opts.find((o: any) => o.name === "userid")?.value;
                const notes = opts.find((o: any) => o.name === "notes")?.value || "";
                const contacts = getContacts();
                contacts.push({ name, userid, notes, added: new Date().toDateString() });
                saveContacts(contacts);
                return { content: `CRM contact added: ${name} (<@${userid}>)` };
            }
        },
        {
            name: "crm-list",
            description: "List all CRM contacts",
            execute() {
                const contacts = getContacts();
                if (!contacts.length) return { content: "No CRM contacts yet. Use /crm-add to add one." };
                return { content: `**CRM Contacts:**\n${contacts.map((c: any) => `${c.name} (<@${c.userid}>) - ${c.notes || "No notes"}`).join("\n")}` };
            }
        }
    ]
});
