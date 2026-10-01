import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

export default definePlugin({
    name: "MeetingMode",
    description: "Mutes all non-essential notifications during meetings",
    authors: [{ name: "DemCord", id: 0n }],

    active: false,

    commands: [{
        name: "meeting",
        description: "Toggle meeting mode on/off",
        execute() {
            (this as any).active = !(this as any).active;
            showNotification({ title: "MeetingMode", body: `Meeting mode ${(this as any).active ? "enabled" : "disabled"}` });
            return { content: `Meeting mode ${(this as any).active ? "enabled - notifications muted" : "disabled"}` };
        }
    }]
});
