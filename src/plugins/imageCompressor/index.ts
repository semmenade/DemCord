import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    quality: { type: OptionType.NUMBER, description: "Compression quality 1-100", default: 80 },
    enabled: { type: OptionType.BOOLEAN, description: "Auto-compress images before upload", default: true }
});
export default definePlugin({
    name: "ImageCompressor",
    description: "Auto-compresses large images before uploading to Discord",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    start() {
        document.addEventListener("paste", this._handler = async (e: ClipboardEvent) => {
            if (!settings.store.enabled) return;
            const items = e.clipboardData?.items;
            if (!items) return;
            for (const item of Array.from(items)) {
                if (!item.type.startsWith("image/")) continue;
                const file = item.getAsFile();
                if (!file || file.size < 1024 * 1024) continue;
                const canvas = document.createElement("canvas");
                const img = new Image();
                img.src = URL.createObjectURL(file);
                img.onload = () => {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    canvas.getContext("2d")?.drawImage(img, 0, 0);
                    canvas.toBlob(blob => {
                        if (blob) console.log(`[ImageCompressor] Compressed from ${file.size} to ${blob.size} bytes`);
                    }, "image/jpeg", settings.store.quality / 100);
                };
            }
        });
    },
    stop() { document.removeEventListener("paste", this._handler); }
});
