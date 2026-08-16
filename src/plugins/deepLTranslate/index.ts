import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    apiKey: { type: OptionType.STRING, description: "DeepL API key (free at deepl.com)", default: "" },
    targetLang: { type: OptionType.STRING, description: "Target language e.g. EN DE FR", default: "EN" }
});
export default definePlugin({
    name: "DeepLTranslate",
    description: "Better translation using DeepL instead of Google Translate",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    commands: [{
        name: "deepl",
        description: "Translate text using DeepL",
        options: [{ name: "text", description: "Text to translate", type: 3, required: true }],
        async execute(opts) {
            const text = opts.find((o: any) => o.name === "text")?.value;
            if (!settings.store.apiKey) return { content: "Set your DeepL API key in plugin settings first." };
            try {
                const res = await fetch("https://api-free.deepl.com/v2/translate", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: `auth_key=${settings.store.apiKey}&text=${encodeURIComponent(text)}&target_lang=${settings.store.targetLang}`
                });
                const data = await res.json();
                return { content: `Translation (${settings.store.targetLang}): ${data.translations?.[0]?.text}` };
            } catch { return { content: "Translation failed. Check your API key." }; }
        }
    }]
});
