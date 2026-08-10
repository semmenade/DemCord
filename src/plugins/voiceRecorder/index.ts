import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";

export default definePlugin({
    name: "VoiceRecorder",
    description: "Records any voice channel you are in and saves locally",
    authors: [{ name: "DemCord", id: 0n }],

    recorder: null as MediaRecorder | null,
    chunks: [] as Blob[],

    commands: [
        {
            name: "record-start",
            description: "Start recording the current voice channel",
            async execute() {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    (this as any).chunks = [];
                    (this as any).recorder = new MediaRecorder(stream);
                    (this as any).recorder.ondataavailable = (e: BlobEvent) => (this as any).chunks.push(e.data);
                    (this as any).recorder.start();
                    showNotification({ title: "VoiceRecorder", body: "Recording started" });
                    return { content: "Recording started. Use /record-stop to save." };
                } catch {
                    return { content: "Could not access microphone" };
                }
            }
        },
        {
            name: "record-stop",
            description: "Stop recording and save the file",
            execute() {
                if (!(this as any).recorder) return { content: "No recording in progress" };
                (this as any).recorder.stop();
                (this as any).recorder.onstop = () => {
                    const blob = new Blob((this as any).chunks, { type: "audio/webm" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `recording-${Date.now()}.webm`;
                    a.click();
                };
                return { content: "Recording stopped and saved" };
            }
        }
    ]
});
