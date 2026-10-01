import definePlugin, { OptionType } from "@utils/types";
import { definePluginSettings } from "@api/Settings";
const settings = definePluginSettings({
    opacity: { type: OptionType.NUMBER, description: "Matrix rain opacity 0-100", default: 15 },
    color: { type: OptionType.STRING, description: "Rain color hex", default: "#a855f7" }
});
export default definePlugin({
    name: "MatrixRain",
    description: "Matrix digital rain effect as Discord background",
    authors: [{ name: "DemCord", id: 0n }],
    settings,
    canvas: null as HTMLCanvasElement | null,
    animFrame: null as number | null,
    start() {
        const canvas = document.createElement("canvas");
        canvas.id = "demcord-matrix";
        canvas.style.cssText = `position:fixed;top:0;left:0;width:100%;height:100%;z-index:0;pointer-events:none;opacity:${settings.store.opacity / 100};`;
        document.body.appendChild(canvas);
        this.canvas = canvas;
        const ctx = canvas.getContext("2d")!;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const cols = Math.floor(canvas.width / 16);
        const drops = Array(cols).fill(1);
        const draw = () => {
            ctx.fillStyle = "rgba(0,0,0,0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = settings.store.color;
            ctx.font = "14px monospace";
            drops.forEach((y, i) => {
                const char = String.fromCharCode(0x30A0 + Math.random() * 96);
                ctx.fillText(char, i * 16, y * 16);
                if (y * 16 > canvas.height && Math.random() > 0.975) drops[i] = 0;
                drops[i]++;
            });
            (this as any).animFrame = requestAnimationFrame(draw);
        };
        draw();
    },
    stop() {
        if (this.animFrame) cancelAnimationFrame(this.animFrame);
        this.canvas?.remove();
    }
});
