import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    anniversaries: { type: OptionType.STRING, description: "Friendship start dates", default: "{}", hidden: true }
});
function getAnniversaries() { try { return JSON.parse(settings.store.anniversaries); } catch { return {}; } }
function saveAnniversaries(a: any) { settings.store.anniversaries = JSON.stringify(a); }
export default definePlugin({
    name: "FriendshipAnniversary",
    description: "Notifies you of anniversaries with Discord friends",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            const a = getAnniversaries();
            const today = `${new Date().getMonth()+1}/${new Date().getDate()}`;
            Object.entries(a).forEach(([id, date]: any) => {
                const d = new Date(date);
                const annivDay = `${d.getMonth()+1}/${d.getDate()}`;
                if (annivDay === today) {
                    const years = new Date().getFullYear() - d.getFullYear();
                    showNotification({ title: "Friendship Anniversary", body: `${years} year anniversary with <@${id}>!` });
                }
            });
        }, 3600000);
    },
    stop() { clearInterval(this.interval); },
    commands: [
        { name: "anniversary-add", description: "Add a friendship anniversary", options: [{ name: "userid", description: "User ID", type: 3, required: true }, { name: "date", description: "Friendship start date YYYY-MM-DD", type: 3, required: true }], execute(opts: any[]) { const id = opts.find((o: any) => o.name === "userid")?.value; const date = opts.find((o: any) => o.name === "date")?.value; const a = getAnniversaries(); a[id] = date; saveAnniversaries(a); return { content: `Anniversary saved for <@${id}> starting ${date}` }; } }
    ]
});
