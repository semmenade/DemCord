import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "GifMaker",
    description: "Record a screen clip and convert to GIF to send in Discord",
    authors: [{ name: "DemCord", id: 0n }],
    recorder: null as MediaRecorder | null,
    chunks: [] as Blob[],
    commands: [
        {
            name: "gif-start",
            description: "Start recording for GIF",
            async execute() {
                try {
                    const stream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true });
                    (this as any).chunks = [];
                    (this as any).recorder = new MediaRecorder(stream);
                    (this as any).recorder.ondataavailable = (e: BlobEvent) => (this as any).chunks.push(e.data);
                    (this as any).recorder.start();
                    showNotification({ title: "GifMaker", body: "Recording started. Use /gif-stop to save." });
                    return { content: "GIF recording started" };
                } catch { return { content: "Could not start recording" }; }
            }
        },
        {
            name: "gif-stop",
            description: "Stop recording and save as WebM",
            execute() {
                if (!(this as any).recorder) return { content: "No recording in progress" };
                (this as any).recorder.stop();
                (this as any).recorder.onstop = () => {
                    const blob = new Blob((this as any).chunks, { type: "video/webm" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `clip-${Date.now()}.webm`;
                    a.click();
                };
                return { content: "Clip saved" };
            }
        }
    ]
});
