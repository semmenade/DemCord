import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "VoiceMeetingRecorder",
    description: "Records voice meetings and saves them locally",
    authors: [{ name: "DemCord", id: 0n }],
    recorder: null as MediaRecorder | null,
    chunks: [] as Blob[],
    commands: [
        { name: "record-meeting", description: "Start recording the voice channel", async execute() { try { const stream = await navigator.mediaDevices.getUserMedia({ audio: true }); (this as any).chunks = []; (this as any).recorder = new MediaRecorder(stream); (this as any).recorder.ondataavailable = (e: BlobEvent) => (this as any).chunks.push(e.data); (this as any).recorder.start(); showNotification({ title: "VoiceMeetingRecorder", body: "Recording started" }); return { content: "Recording started. Use /stop-meeting to save." }; } catch { return { content: "Could not access microphone" }; } } },
        { name: "stop-meeting", description: "Stop recording and save", execute() { if (!(this as any).recorder) return { content: "No recording in progress" }; (this as any).recorder.stop(); (this as any).recorder.onstop = () => { const blob = new Blob((this as any).chunks, { type: "audio/webm" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `meeting-${Date.now()}.webm`; a.click(); }; return { content: "Meeting recording saved" }; } }
    ]
});
