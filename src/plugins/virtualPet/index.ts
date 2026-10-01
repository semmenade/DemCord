import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    pet: { type: OptionType.STRING, description: "Pet data", default: '{"name":"Demi","hunger":100,"happy":100,"level":1}', hidden: true }
});
function getPet() { try { return JSON.parse(settings.store.pet); } catch { return { name: "Demi", hunger: 100, happy: 100, level: 1 }; } }
function savePet(p: any) { settings.store.pet = JSON.stringify(p); }
export default definePlugin({
    name: "VirtualPet",
    description: "A little creature that lives in your DemCord that you can feed and play with",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    interval: null as any,
    start() {
        this.interval = setInterval(() => {
            const p = getPet();
            p.hunger = Math.max(0, p.hunger - 1);
            p.happy = Math.max(0, p.happy - 1);
            savePet(p);
        }, 60000);
    },
    stop() { clearInterval(this.interval); },
    commands: [
        {
            name: "pet",
            description: "Check on your virtual pet",
            execute() {
                const p = getPet();
                return { content: `**${p.name}** (Level ${p.level})\nHunger: ${p.hunger}/100\nHappiness: ${p.happy}/100` };
            }
        },
        {
            name: "pet-feed",
            description: "Feed your virtual pet",
            execute() {
                const p = getPet();
                p.hunger = Math.min(100, p.hunger + 30);
                savePet(p);
                return { content: `${p.name} enjoyed the food! Hunger: ${p.hunger}/100` };
            }
        },
        {
            name: "pet-play",
            description: "Play with your virtual pet",
            execute() {
                const p = getPet();
                p.happy = Math.min(100, p.happy + 25);
                p.level = p.happy >= 100 ? p.level + 1 : p.level;
                savePet(p);
                return { content: `${p.name} had fun! Happiness: ${p.happy}/100` };
            }
        }
    ]
});
