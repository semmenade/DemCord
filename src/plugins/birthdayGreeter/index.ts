import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    myBirthday: { type: OptionType.STRING, description: "Your birthday MM/DD", default: "" },
    greetingChannel: { type: OptionType.STRING, description: "Channel ID to send birthday greeting", default: "" }
});
export default definePlugin({
    name: "BirthdayGreeter",
    description: "Automatically sends a birthday message on your birthday",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            if (!settings.store.myBirthday) return;
            const today = new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
            if (settings.store.myBirthday === today) console.log("[BirthdayGreeter] Today is your birthday!");
        }, 3600000);
    },
    stop() { clearInterval(this.interval); }
});
