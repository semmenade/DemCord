import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    birthdays: { type: OptionType.STRING, description: "Friend birthdays JSON", default: "{}", hidden: true }
});
function getBirthdays() { try { return JSON.parse(settings.store.birthdays); } catch { return {}; } }
function saveBirthdays(b: any) { settings.store.birthdays = JSON.stringify(b); }
export default definePlugin({
    name: "FriendBirthday",
    description: "Track friend birthdays and get Discord reminders",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            const today = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
            const birthdays = getBirthdays();
            Object.entries(birthdays).forEach(([id, date]: any) => {
                if (date.endsWith(today)) showNotification({ title: "Birthday", body: `Today is <@${id}>'s birthday!` });
            });
        }, 3600000);
    },
    stop() { clearInterval(this.interval); },
    commands: [
        {
            name: "birthday-set",
            description: "Set a friend birthday",
            options: [
                { name: "userid", description: "User ID", type: 3, required: true },
                { name: "date", description: "Birthday MM/DD e.g. 06/15", type: 3, required: true }
            ],
            execute(opts) {
                const id = opts.find((o: any) => o.name === "userid")?.value;
                const date = opts.find((o: any) => o.name === "date")?.value;
                const b = getBirthdays();
                b[id] = date;
                saveBirthdays(b);
                return { content: `Birthday saved for <@${id}>: ${date}` };
            }
        },
        {
            name: "birthdays",
            description: "List all saved birthdays",
            execute() {
                const b = getBirthdays();
                if (!Object.keys(b).length) return { content: "No birthdays saved yet" };
                return { content: `**Saved Birthdays:**\n${Object.entries(b).map(([id, d]) => `<@${id}>: ${d}`).join("\n")}` };
            }
        }
    ]
});
