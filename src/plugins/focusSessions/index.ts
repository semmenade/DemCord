import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
import { showNotification } from "@api/Notifications";
const settings = definePluginSettings({
    workMinutes: { type: OptionType.NUMBER, description: "Work session duration in minutes", default: 25 },
    breakMinutes: { type: OptionType.NUMBER, description: "Break duration in minutes", default: 5 }
});
export default definePlugin({
    name: "FocusSessions",
    description: "Pomodoro timer built into Discord with auto DND mode",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    timer: null as any,
    phase: "idle" as string,
    commands: [
        { name: "focus-start", description: "Start a focus session", execute() { (this as any).phase = "work"; const mins = settings.store.workMinutes; showNotification({ title: "Focus Session", body: `Work session started - ${mins} minutes` }); (this as any).timer = setTimeout(() => { showNotification({ title: "Focus Session", body: "Work session complete! Take a break." }); (this as any).phase = "break"; }, mins * 60000); return { content: `Focus session started - ${mins} minutes. Use /focus-stop to cancel.` }; } },
        { name: "focus-stop", description: "Stop focus session", execute() { clearTimeout((this as any).timer); (this as any).phase = "idle"; return { content: "Focus session stopped" }; } },
        { name: "focus-status", description: "Check focus session status", execute() { return { content: `Focus status: ${(this as any).phase}` }; } }
    ]
});
