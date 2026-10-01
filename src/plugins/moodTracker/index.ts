import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    moods: { type: OptionType.STRING, description: "Mood history", default: "[]", hidden: true }
});

function getMoods() { try { return JSON.parse(settings.store.moods); } catch { return []; } }
function saveMoods(m: any[]) { settings.store.moods = JSON.stringify(m); }

export default definePlugin({
    name: "MoodTracker",
    description: "Log your daily mood and see trends over time",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    commands: [
        {
            name: "mood",
            description: "Log your current mood",
            options: [
                {
                    name: "rating",
                    description: "Mood rating 1-10",
                    type: 10,
                    required: true
                },
                {
                    name: "note",
                    description: "Optional note about your mood",
                    type: 3,
                    required: false
                }
            ],
            execute(opts) {
                const rating = opts.find((o: any) => o.name === "rating")?.value;
                const note = opts.find((o: any) => o.name === "note")?.value || "";
                const moods = getMoods();
                moods.push({ rating, note, date: new Date().toDateString(), time: Date.now() });
                saveMoods(moods);
                return { content: `Mood logged: ${rating}/10${note ? ` - ${note}` : ""}` };
            }
        },
        {
            name: "moodhistory",
            description: "Show your mood history",
            execute() {
                const moods = getMoods().slice(-10).reverse();
                if (!moods.length) return { content: "No mood entries yet. Use /mood to log your first one." };
                const avg = (moods.reduce((a: number, m: any) => a + m.rating, 0) / moods.length).toFixed(1);
                return { content: `**Mood History (avg: ${avg}/10)**\n${moods.map((m: any) => `${m.date}: ${m.rating}/10${m.note ? ` - ${m.note}` : ""}`).join("\n")}` };
            }
        }
    ]
});
