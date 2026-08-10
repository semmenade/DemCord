import definePlugin from "@utils/types";

export default definePlugin({
    name: "QRGenerator",
    description: "Generate QR codes from any text or link",
    authors: [{ name: "DemCord", id: 0n }],

    commands: [{
        name: "qr",
        description: "Generate a QR code",
        options: [{ name: "text", description: "Text or URL to encode", type: 3, required: true }],
        execute(opts) {
            const text = opts.find((o: any) => o.name === "text")?.value;
            const url = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;
            return { content: `QR Code for: ${text}\n${url}` };
        }
    }]
});
