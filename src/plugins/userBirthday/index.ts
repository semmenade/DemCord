import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    birthdays: { type: OptionType.STRING, description: "User birthdays JSON", default: "{}", hidden: true }
});
function getBirthdays() { try { return JSON.parse(settings.store.birthdays); } catch { return {}; } }
function saveBirthdays(b: any) { settings.store.birthdays = JSON.stringify(b); }
export default definePlugin({
    name: "UserBirthday",
    description: "Track and celebrate user birthdays in your server",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            const today = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
            const b = getBirthdays();
            Object.entries(b).forEach(([id, date]: any) => {
                if (date === today) showNotification({ title: "Birthday", body: `Today is <@${id}>'s birthday!` });
            });
        }, 3600000);
    },
    stop() { clearInterval(this.interval); },
    commands: [
        { name: "birthday-add", description: "Add a user birthday", options: [{ name: "userid", description: "User ID", type: 3, required: true }, { name: "date", description: "Birthday MM/DD", type: 3, required: true }], execute(opts: any[]) { const id = opts.find((o: any) => o.name === "userid")?.value; const date = opts.find((o: any) => o.name === "date")?.value; const b = getBirthdays(); b[id] = date; saveBirthdays(b); return { content: `Birthday saved for <@${id}>: ${date}` }; } },
        { name: "birthday-list", description: "List all birthdays", execute() { const b = getBirthdays(); if (!Object.keys(b).length) return { content: "No birthdays saved" }; return { content: `**Birthdays:**\n${Object.entries(b).map(([id, d]) => `<@${id}>: ${d}`).join("\n")}` }; } }
    ]
});
