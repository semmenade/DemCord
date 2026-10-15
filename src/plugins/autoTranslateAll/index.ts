import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    targetLang: { type: OptionType.STRING, description: "Your language code e.g. en es fr de", default: "en" },
    enabled: { type: OptionType.BOOLEAN, description: "Auto-translate all foreign messages", default: false }
});
export default definePlugin({
    name: "AutoTranslateAll",
    description: "Automatically translates all foreign language messages to your language",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    start() {
        const observer = new MutationObserver((mutations) => {
            if (!settings.store.enabled) return;
            for (const m of mutations) {
                for (const node of Array.from(m.addedNodes)) {
                    const el = node as HTMLElement;
                    const content = el.querySelector?.("[class*='messageContent']") as HTMLElement;
                    if (!content || content.dataset.translated) return;
                    const text = content.textContent?.trim();
                    if (!text || text.length < 3) return;
                    fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${settings.store.targetLang}&dt=t&q=${encodeURIComponent(text)}`)
                        .then(r => r.json())
                        .then(data => {
                            const translated = data[0]?.[0]?.[0];
                            const detectedLang = data[2];
                            if (!translated || detectedLang === settings.store.targetLang) return;
                            const tag = document.createElement("div");
                            tag.style.cssText = "font-size:11px;color:#9b72cf;margin-top:2px;font-style:italic;";
                            tag.textContent = translated;
                            content.appendChild(tag);
                            content.dataset.translated = "1";
                        }).catch(() => {});
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
        (this as any)._observer = observer;
    },
    stop() { (this as any)._observer?.disconnect(); }
});
