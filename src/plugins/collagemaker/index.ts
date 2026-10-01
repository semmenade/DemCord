import definePlugin from "@utils/types";
export default definePlugin({
    name: "CollageMaker",
    description: "Combine multiple images into one collage before sending",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "collage",
        description: "Create a collage from image URLs",
        options: [
            { name: "urls", description: "Image URLs separated by commas", type: 3, required: true },
            { name: "columns", description: "Number of columns", type: 10, required: false }
        ],
        async execute(opts) {
            const urls = opts.find((o: any) => o.name === "urls")?.value?.split(",").map((s: string) => s.trim());
            const cols = opts.find((o: any) => o.name === "columns")?.value || 2;
            const canvas = document.createElement("canvas");
            const size = 200;
            canvas.width = size * cols;
            canvas.height = size * Math.ceil(urls.length / cols);
            const ctx = canvas.getContext("2d")!;
            for (let i = 0; i < urls.length; i++) {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.src = urls[i];
                await new Promise(r => { img.onload = r; img.onerror = r; });
                const x = (i % cols) * size;
                const y = Math.floor(i / cols) * size;
                ctx.drawImage(img, x, y, size, size);
            }
            canvas.toBlob(blob => {
                if (!blob) return;
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `collage-${Date.now()}.png`;
                a.click();
            });
            return { content: `Collage created with ${urls.length} images` };
        }
    }]
});
