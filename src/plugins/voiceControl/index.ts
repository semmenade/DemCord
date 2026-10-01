import definePlugin from "@utils/types";
import { showNotification } from "@api/Notifications";
export default definePlugin({
    name: "VoiceControl",
    description: "Control Discord with voice commands",
    authors: [{ name: "DemCord", id: 0n }],
    recognition: null as any,
    start() {
        const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SR) { console.warn("[VoiceControl] Speech recognition not supported"); return; }
        this.recognition = new SR();
        this.recognition.continuous = true;
        this.recognition.onresult = (e: any) => {
            const command = e.results[e.results.length - 1][0].transcript.toLowerCase().trim();
            if (command.includes("mute")) showNotification({ title: "VoiceControl", body: `Command: ${command}` });
        };
        this.recognition.start();
    },
    stop() { this.recognition?.stop(); }
});
