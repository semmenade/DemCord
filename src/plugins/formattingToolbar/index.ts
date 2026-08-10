import definePlugin from "@utils/types";

export default definePlugin({
    name: "FormattingToolbar",
    description: "Adds a formatting toolbar with buttons for bold italic code and more",
    authors: [{ name: "DemCord", id: 0n }],

    start() {
        const observer = new MutationObserver(() => {
            const textArea = document.querySelector("[class*='textArea']");
            if (!textArea || document.getElementById("demcord-toolbar")) return;
            const toolbar = document.createElement("div");
            toolbar.id = "demcord-toolbar";
            toolbar.style.cssText = "display:flex;gap:4px;padding:4px 8px;background:rgba(26,0,51,0.6);border-radius:8px;margin-bottom:4px;";
            const buttons = [
                { label: "B", wrap: "**", style: "font-weight:700;" },
                { label: "I", wrap: "*", style: "font-style:italic;" },
                { label: "U", wrap: "__", style: "text-decoration:underline;" },
                { label: "S", wrap: "~~", style: "text-decoration:line-through;" },
                { label: "<>", wrap: "`", style: "font-family:monospace;" },
                { label: "```", wrap: "```\n", style: "font-family:monospace;" }
            ];
            buttons.forEach(b => {
                const btn = document.createElement("button");
                btn.textContent = b.label;
                btn.style.cssText = `${b.style}padding:2px 8px;background:rgba(168,85,247,0.2);border:1px solid rgba(168,85,247,0.3);border-radius:4px;color:#e9d5ff;cursor:pointer;font-size:12px;`;
                btn.onclick = () => {
                    const input = textArea.querySelector("div[contenteditable]") as HTMLElement;
                    if (input) {
                        input.focus();
                        document.execCommand("insertText", false, b.wrap + "text" + b.wrap);
                    }
                };
                toolbar.appendChild(btn);
            });
            textArea.parentElement?.insertBefore(toolbar, textArea);
        });
        observer.observe(document.body, { childList: true, subtree: true });
        (this as any)._observer = observer;
    },

    stop() {
        (this as any)._observer?.disconnect();
        document.getElementById("demcord-toolbar")?.remove();
    }
});
