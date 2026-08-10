import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    notes: { type: OptionType.STRING, description: "Saved notes", default: "{}", hidden: true }
});

function getNotes() { try { return JSON.parse(settings.store.notes); } catch { return {}; } }
function saveNotes(n: any) { settings.store.notes = JSON.stringify(n); }

export default definePlugin({
    name: "NoteTaker",
    description: "Per-server and per-channel notes only visible to you",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    commands: [
        {
            name: "note-set",
            description: "Set a note for this channel",
            options: [{ name: "text", description: "Note text", type: 3, required: true }],
            execute(opts, ctx) {
                const text = opts.find((o: any) => o.name === "text")?.value;
                const notes = getNotes();
                notes[ctx.channel.id] = text;
                saveNotes(notes);
                return { content: `Note saved for this channel` };
            }
        },
        {
            name: "note-get",
            description: "Get note for this channel",
            execute(_, ctx) {
                const notes = getNotes();
                return { content: notes[ctx.channel.id] || "No note for this channel. Use /note-set to add one." };
            }
        },
        {
            name: "note-clear",
            description: "Clear note for this channel",
            execute(_, ctx) {
                const notes = getNotes();
                delete notes[ctx.channel.id];
                saveNotes(notes);
                return { content: "Note cleared" };
            }
        }
    ]
});
