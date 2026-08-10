import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    notes: { type: OptionType.STRING, description: "Friend notes", default: "{}", hidden: true }
});

function getNotes() { try { return JSON.parse(settings.store.notes); } catch { return {}; } }
function saveNotes(n: any) { settings.store.notes = JSON.stringify(n); }

export default definePlugin({
    name: "FriendNotes",
    description: "Add private notes to any user visible only to you",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    commands: [
        {
            name: "usernote-set",
            description: "Set a note for a user",
            options: [
                { name: "userid", description: "User ID", type: 3, required: true },
                { name: "note", description: "Note text", type: 3, required: true }
            ],
            execute(opts) {
                const userId = opts.find((o: any) => o.name === "userid")?.value;
                const note = opts.find((o: any) => o.name === "note")?.value;
                const notes = getNotes();
                notes[userId] = note;
                saveNotes(notes);
                return { content: `Note saved for user ${userId}` };
            }
        },
        {
            name: "usernote-get",
            description: "Get note for a user",
            options: [{ name: "userid", description: "User ID", type: 3, required: true }],
            execute(opts) {
                const userId = opts.find((o: any) => o.name === "userid")?.value;
                const notes = getNotes();
                return { content: notes[userId] || `No note for user ${userId}` };
            }
        }
    ]
});
