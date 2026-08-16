import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    pins: { type: OptionType.STRING, description: "Pinned messages", default: "[]", hidden: true }
});
function getPins() { try { return JSON.parse(settings.store.pins); } catch { return []; } }
function savePins(p: any[]) { settings.store.pins = JSON.stringify(p); }
export default definePlugin({
    name: "MessagePin",
    description: "Personal message pins only you can see separate from server pins",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [
        {
            name: "pin",
            description: "Pin a message by ID",
            options: [
                { name: "messageid", description: "Message ID to pin", type: 3, required: true },
                { name: "note", description: "Optional note", type: 3, required: false }
            ],
            execute(opts, ctx) {
                const id = opts.find((o: any) => o.name === "messageid")?.value;
                const note = opts.find((o: any) => o.name === "note")?.value || "";
                const pins = getPins();
                pins.push({ id, channelId: ctx.channel.id, note, date: new Date().toDateString() });
                savePins(pins);
                return { content: `Message pinned${note ? `: ${note}` : ""}` };
            }
        },
        {
            name: "pins",
            description: "Show your personal pins",
            execute() {
                const pins = getPins();
                if (!pins.length) return { content: "No personal pins yet. Use /pin to add one." };
                return { content: `**Your Pins:**\n${pins.map((p: any, i: number) => `${i + 1}. ${p.date} in <#${p.channelId}>: ${p.note || p.id}`).join("\n")}` };
            }
        }
    ]
});
