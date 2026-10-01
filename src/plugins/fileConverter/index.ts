import definePlugin from "@utils/types";
export default definePlugin({
    name: "FileConverter",
    description: "Convert files between formats before sending in Discord",
    authors: [{ name: "DemCord", id: 0n }],
    commands: [{
        name: "convert",
        description: "Convert an image to a different format",
        options: [
            { name: "url", description: "Image URL to convert", type: 3, required: true },
            { name: "format", description: "Target format: png, jpg, webp", type: 3, required: true }
        ],
        async execute(opts) {
            const url = opts.find((o: any) => o.name === "url")?.value;
            const format = opts.find((o: any) => o.name === "format")?.value;
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = url;
            await new Promise(r => { img.onload = r; img.onerror = r; });
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;
            canvas.getContext("2d")?.drawImage(img, 0, 0);
            canvas.toBlob(blob => {
                if (!blob) return;
                const a = document.createElement("a");
                a.href = URL.createObjectURL(blob);
                a.download = `converted-${Date.now()}.${format}`;
                a.click();
            }, `image/${format}`);
            return { content: `Converting image to ${format}...` };
        }
    }]
});
