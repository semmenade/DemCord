import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    targetLang: { type: OptionType.STRING, description: "Target language code e.g. en", default: "en" },
    enabled: { type: OptionType.BOOLEAN, description: "Enable hover translation", default: false }
});
export default definePlugin({
    name: "MessageTranslationHover",
    description: "Hover over any foreign language message to see translation inline",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    start() {
        document.addEventListener("mouseover", this._handler = async (e: MouseEvent) => {
            if (!settings.store.enabled) return;
            const target = e.target as HTMLElement;
            const content = target.closest("[class*='messageContent']") as HTMLElement;
            if (!content || content.dataset.translated) return;
            const text = content.textContent?.trim();
            if (!text || text.length < 5) return;
            try {
                const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${settings.store.targetLang}&dt=t&q=${encodeURIComponent(text)}`);
                const data = await res.json();
                const translated = data[0]?.[0]?.[0];
                const detectedLang = data[2];
                if (!translated || detectedLang === settings.store.targetLang) return;
                const tooltip = document.createElement("div");
                tooltip.style.cssText = "position:absolute;background:rgba(13,0,16,0.95);border:1px solid rgba(168,85,247,0.4);border-radius:8px;padding:6px 10px;font-size:12px;color:#e9d5ff;z-index:99999;max-width:300px;pointer-events:none;backdrop-filter:blur(8px);";
                tooltip.textContent = translated;
                const rect = content.getBoundingClientRect();
                tooltip.style.top = `${rect.bottom + window.scrollY + 4}px`;
                tooltip.style.left = `${rect.left + window.scrollX}px`;
                document.body.appendChild(tooltip);
                content.dataset.translated = "1";
                content.addEventListener("mouseleave", () => { tooltip.remove(); delete content.dataset.translated; }, { once: true });
            } catch {}
        });
    },
    stop() { document.removeEventListener("mouseover", this._handler); }
});
