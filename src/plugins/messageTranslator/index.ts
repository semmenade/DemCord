import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";

const settings = definePluginSettings({
    targetLang: { type: OptionType.STRING, description: "Target language code e.g. en", default: "en" },
    autoTranslate: { type: OptionType.BOOLEAN, description: "Auto translate all messages", default: false }
});

export default definePlugin({
    name: "MessageTranslator",
    description: "Auto translates foreign messages inline using Google Translate",
    authors: [{ name: "DemCord", id: 0n }],
    settings,

    commands: [{
        name: "translate",
        description: "Translate a message",
        options: [{ name: "text", description: "Text to translate", type: 3, required: true }],
        async execute(opts) {
            const text = opts.find((o: any) => o.name === "text")?.value;
            const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${settings.store.targetLang}&dt=t&q=${encodeURIComponent(text)}`);
            const data = await res.json();
            return { content: ` ${data[0][0][0]}` };
        }
    }]
});

