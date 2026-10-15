import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "VoiceTranscriber",
    description: "Real-time transcription of voice chat to text in a side panel",
    authors: [{ name: "DemCord", id: 0n }],
    recognition: null as any,
    transcriptEl: null as HTMLDivElement | null,
    start() {
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) { console.warn("[VoiceTranscriber] Speech recognition not supported"); return; }
        const panel = document.createElement("div");
        panel.id = "demcord-transcript";
        panel.style.cssText = "display:none;position:fixed;bottom:60px;right:10px;width:280px;max-height:200px;background:rgba(13,0,16,0.95);border:1px solid rgba(168,85,247,0.4);border-radius:10px;padding:10px;font-size:11px;color:#e9d5ff;z-index:99998;overflow-y:auto;backdrop-filter:blur(12px);";
        document.body.appendChild(panel);
        this.transcriptEl = panel;
    },
    stop() { this.recognition?.stop(); this.transcriptEl?.remove(); },
    commands: [
        { name: "transcribe-start", description: "Start voice transcription", execute() {
            const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (!SR) return { content: "Speech recognition not supported in this browser" };
            (this as any).recognition = new SR();
            (this as any).recognition.continuous = true;
            (this as any).recognition.interimResults = true;
            (this as any).recognition.onresult = (e: any) => {
                const text = Array.from(e.results).map((r: any) => r[0].transcript).join(" ");
                if ((this as any).transcriptEl) { (this as any).transcriptEl.style.display = "block"; (this as any).transcriptEl.textContent = text; }
            };
            (this as any).recognition.start();
            return { content: "Voice transcription started. Panel visible bottom-right." };
        }},
        { name: "transcribe-stop", description: "Stop voice transcription", execute() { (this as any).recognition?.stop(); if ((this as any).transcriptEl) (this as any).transcriptEl.style.display = "none"; return { content: "Transcription stopped" }; } }
    ]
});
